const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Tribbu = require("../models/Tribbu.model");
const User = require("../models/User.model");
const Invitation = require("../models/Invitation.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const { checkTribbuRole } = require("../middleware/auth.middleware");
const { sendInvitationEmail } = require("../utils/mailer");

router.post("/tribbus", isAuthenticated, (req, res) => {
  const { name } = req.body;
  const ownerId = req.payload._id;

  Tribbu.create({ name, ownerId, members: [] })
    .then((tribbu) =>
      User.findByIdAndUpdate(ownerId, { tribbuId: tribbu._id }, { new: true }).then(() =>
        res.json(tribbu)
      )
    )
    .catch((err) => {
      console.log("Error while creating a Tribbu", err);
      res.status(500).json({ error: "Error while creating a Tribbu" });
    });
});

router.get("/tribbus", (_req, res) => {
  Tribbu.find()
    .populate("ownerId")
    .populate("members.userId")
    .then((tribbus) => res.json(tribbus))
    .catch((err) => {
      console.log("Error while getting the Tribbus", err);
      res.status(500).json({ error: "Error while getting the Tribbus" });
    });
});

router.get("/tribbus/user/my-tribbus", isAuthenticated, (req, res) => {
  const userId = req.payload._id;

  Tribbu.find({ $or: [{ ownerId: userId }, { "members.userId": userId }] })
    .populate("ownerId")
    .populate("members.userId")
    .then((tribbus) => res.json(tribbus))
    .catch((err) => {
      console.log("Error while getting user tribbus", err);
      res.status(500).json({ error: "Error while getting user tribbus" });
    });
});

router.get("/tribbus/:tribbuId", (req, res) => {
  const { tribbuId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(tribbuId)) {
    return res.status(400).json({ error: "Specified id is not valid" });
  }

  Tribbu.findById(tribbuId)
    .populate("ownerId")
    .populate("members.userId")
    .populate("children")
    .then((tribbu) => res.status(200).json(tribbu))
    .catch((err) => {
      console.log("Error while retrieving a Tribbu", err);
      res.status(500).json({ error: "Error while retrieving a Tribbu" });
    });
});

router.put("/tribbus/:tribbuId", isAuthenticated, checkTribbuRole(["GUARDIÁN"]), (req, res) => {
  const { tribbuId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(tribbuId)) {
    return res.status(400).json({ error: "Specified id is not valid" });
  }

  Tribbu.findByIdAndUpdate(tribbuId, req.body, { new: true })
    .populate("ownerId")
    .populate("members.userId")
    .then((updatedTribbu) => res.json(updatedTribbu))
    .catch((err) => {
      console.log("Error while updating a Tribbu", err);
      res.status(500).json({ error: "Error while updating a Tribbu" });
    });
});

router.delete("/tribbus/:tribbuId", isAuthenticated, checkTribbuRole(["GUARDIÁN"]), (req, res) => {
  const { tribbuId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(tribbuId)) {
    return res.status(400).json({ error: "Specified id is not valid" });
  }

  Tribbu.findByIdAndDelete(tribbuId)
    .then(() => res.json({ message: `Tribbu with ${tribbuId} is removed successfully.` }))
    .catch((err) => {
      console.log("Error while deleting a Tribbu", err);
      res.status(500).json({ error: "Error while deleting a Tribbu" });
    });
});

router.post(
  "/tribbus/:tribbuId/members",
  isAuthenticated,
  checkTribbuRole(["GUARDIÁN"]),
  (req, res) => {
    const { tribbuId } = req.params;
    const { userId, role } = req.body;

    if (!mongoose.Types.ObjectId.isValid(tribbuId)) {
      return res.status(400).json({ error: "Specified id is not valid" });
    }

    Tribbu.findByIdAndUpdate(
      tribbuId,
      { $push: { members: { userId, role } } },
      { new: true }
    )
      .populate("ownerId")
      .populate("members.userId")
      .then((tribbu) => res.status(200).json(tribbu))
      .catch((err) => {
        console.log("Error adding member:", err);
        res.status(500).json({ error: "Error adding member" });
      });
  }
);

router.post("/tribbus/:tribbuId/invite", isAuthenticated, async (req, res) => {
  const { tribbuId } = req.params;
  const { email, role } = req.body;
  const userId = req.payload._id;

  if (!mongoose.Types.ObjectId.isValid(tribbuId)) {
    return res.status(400).json({ error: "Specified id is not valid" });
  }

  try {
    const tribbu = await Tribbu.findById(tribbuId);
    if (!tribbu) return res.status(404).json({ message: "Tribbu not found" });

    const member = tribbu.members?.find((m) => String(m.userId) === String(userId));
    if (member?.role !== "GUARDIÁN" && String(tribbu.ownerId) !== String(userId)) {
      return res.status(403).json({ message: "Solo GUARDIÁN puede invitar miembros" });
    }

    const existingInvitation = await Invitation.findOne({
      email: email.toLowerCase(),
      tribbuId,
      status: "pending",
    });
    if (existingInvitation) {
      return res.status(400).json({ message: "Este usuario ya ha sido invitado a esta tribbu" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      const alreadyMember = tribbu.members?.some(
        (m) => String(m.userId) === String(existingUser._id)
      );
      if (alreadyMember) {
        return res.status(400).json({ message: "Este usuario ya es miembro de la tribbu" });
      }
    }

    const invitation = await Invitation.create({
      email: email.toLowerCase(),
      tribbuId,
      role: role || "SABIO",
      invitedBy: userId,
      status: "pending",
    });

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const hasSmtp = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;

    if (hasSmtp) {
      try {
        await sendInvitationEmail(email, tribbu.name, invitation._id, frontendUrl);
      } catch (mailErr) {
        console.warn("No se pudo enviar el email, invitación creada igualmente:", mailErr.message);
      }
    } else {
      console.warn("SMTP no configurado. Invitación creada sin enviar email.");
    }

    res.json({ message: "Invitación creada correctamente", invitation });
  } catch (err) {
    console.log("Error inviting member", err);
    res.status(500).json({ message: "Error al enviar invitación" });
  }
});

router.get("/invitations/:invitationId", (req, res) => {
  const { invitationId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(invitationId)) {
    return res.status(400).json({ error: "Invalid invitation id" });
  }

  Invitation.findById(invitationId)
    .populate("tribbuId", "name")
    .populate("invitedBy", "name email")
    .then((invitation) => {
      if (!invitation) {
        return res.status(404).json({ message: "Invitación no encontrada" });
      }
      res.json(invitation);
    })
    .catch((err) => {
      console.log("Error fetching invitation", err);
      res.status(500).json({ message: "Error fetching invitation" });
    });
});

router.post("/invitations/:invitationId/accept", isAuthenticated, (req, res) => {
  const { invitationId } = req.params;
  const userId = req.payload._id;

  if (!mongoose.Types.ObjectId.isValid(invitationId)) {
    return res.status(400).json({ error: "Invalid invitation id" });
  }

  Invitation.findById(invitationId)
    .then((invitation) => {
      if (!invitation) return res.status(404).json({ message: "Invitación no encontrada" });
      if (invitation.status !== "pending")
        return res.status(400).json({ message: "Esta invitación ya ha sido procesada" });

      return User.findById(userId).then((user) => {
        if (user.email !== invitation.email) {
          return res.status(403).json({ message: "El email no coincide con tu cuenta" });
        }

        return Tribbu.findById(invitation.tribbuId).then((tribbu) => {
          const alreadyMember = tribbu.members?.some((m) => String(m.userId) === String(userId));
          if (!alreadyMember) {
            tribbu.members.push({
              userId,
              role: invitation.role,
              joinedAt: new Date(),
            });
          }

          return tribbu
            .save()
            .then(() => {
              invitation.status = "accepted";
              invitation.acceptedAt = new Date();
              return invitation.save();
            })
            .then(() => res.json({ message: "¡Te has unido a la tribbu!", tribbu }));
        });
      });
    })
    .catch((err) => {
      console.log("Error accepting invitation", err);
      res.status(500).json({ message: "Error al aceptar invitación" });
    });
});

router.post("/invitations/:invitationId/decline", isAuthenticated, (req, res) => {
  const { invitationId } = req.params;
  const userId = req.payload._id;

  if (!mongoose.Types.ObjectId.isValid(invitationId)) {
    return res.status(400).json({ error: "Invalid invitation id" });
  }

  Invitation.findById(invitationId)
    .then((invitation) => {
      if (!invitation) return res.status(404).json({ message: "Invitación no encontrada" });
      if (invitation.status !== "pending")
        return res.status(400).json({ message: "Esta invitación ya ha sido procesada" });

      return User.findById(userId).then((user) => {
        if (user.email !== invitation.email) {
          return res.status(403).json({ message: "El email no coincide con tu cuenta" });
        }

        invitation.status = "declined";
        invitation.declinedAt = new Date();
        return invitation.save().then(() => res.json({ message: "Invitación rechazada" }));
      });
    })
    .catch((err) => {
      console.log("Error declining invitation", err);
      res.status(500).json({ message: "Error al rechazar invitación" });
    });
});

router.get("/invitations/my-invitations", isAuthenticated, (req, res) => {
  const userEmail = req.payload.email;

  Invitation.find({ email: userEmail, status: "pending" })
    .populate("tribbuId")
    .populate("invitedBy", "name email")
    .then((invitations) => res.json(invitations))
    .catch((err) => {
      console.log("Error fetching invitations", err);
      res.status(500).json({ message: "Error fetching invitations" });
    });
});

module.exports = router;
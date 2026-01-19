const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Tribbu = require("../models/Tribbu.model");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const { checkTribbuRole } = require("../middleware/auth.middleware");

router.post("/tribbus", isAuthenticated, (req, res, next) => {
  console.log ("payload", req.payload)
  const { name } = req.body;
  const ownerId = req.payload._id

  Tribbu.create({ 
    name, 
    ownerId: ownerId, 
    members: [] })
    .then((tribbu) => {
      return User.findByIdAndUpdate(
        ownerId,
        { tribbuId: tribbu._id },
        { new: true }
      ).then(() => res.json(tribbu));
    })
    .catch((err) => {
      console.log("Error while creating a Tribbu", err);
      res.status(500).json({ error: "Error while creating a Tribbu" });
    });
});

router.get("/tribbus", (req, res, next) => {
  Tribbu.find()
    .populate("ownerId")
    .populate("members.userId")
    .then((tribbus) => res.json(tribbus))
    .catch((err) => {
      console.log("Error while getting the Tribbus", err);
      res.status(500).json({ error: "Error while getting the Tribbus" });
    });
});

router.get("/tribbus/user/my-tribbus", isAuthenticated, (req, res, next) => {
  const userId = req.payload._id;

  Tribbu.find({ 
    $or: [
      { ownerId: userId },
      { "members.userId": userId }
    ]
  })
    .populate("ownerId")
    .populate("members.userId")
    .then((tribbus) => res.json(tribbus))
    .catch((err) => {
      console.log("Error while getting user tribbus", err);
      res.status(500).json({ error: "Error while getting user tribbus" });
    });
});

router.get("/tribbus/:tribbuId", (req, res, next) => {
  const { tribbuId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(tribbuId)) {
    res.status(400).json({ error: "Specified id is not valid" });
    return;
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


router.put("/tribbus/:tribbuId", isAuthenticated, checkTribbuRole(["GUARDIÁN"]), (req, res, next) => {
  const { tribbuId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(tribbuId)) {
    res.status(400).json({ error: "Specified id is not valid" });
    return;
  }

  Tribbu.findByIdAndUpdate(tribbuId, req.body, { new: true })
    .then((updatedTribbu) => res.json(updatedTribbu))
    .catch((err) => {
      console.log("Error while updating a Tribbu", err);
      res.status(500).json({ error: "Error while updating a Tribbu" });
    });
});

router.delete("/tribbus/:tribbuId", isAuthenticated, checkTribbuRole(["GUARDIÁN"]), (req, res, next) => {
  const { tribbuId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(tribbuId)) {
    res.status(400).json({ error: "Specified id is not valid" });
    return;
  }

  Tribbu.findByIdAndDelete(tribbuId)
    .then(() =>
      res.json({
        message: `Tribbu with ${tribbuId} is removed successfully.`,
      })
    )
    .catch((err) => {
      console.log("Error while deleting a Tribbu", err);
      res.status(500).json({ error: "Error while deleting a Tribbu" });
    });
});

router.post("/tribbus/:tribbuId/members", isAuthenticated, checkTribbuRole(["GUARDIÁN"]), (req, res, next) => {
  const { tribbuId } = req.params;
  const { userId, role } = req.body;

  if (!mongoose.Types.ObjectId.isValid(tribbuId)) {
    res.status(400).json({ error: "Specified id is not valid" });
    return;
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
});

module.exports = router;

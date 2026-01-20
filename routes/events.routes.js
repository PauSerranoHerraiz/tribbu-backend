const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Event = require("../models/Event.model");
const Tribbu = require("../models/Tribbu.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const { checkEventRole } = require("../middleware/auth.middleware");

router.post("/events", isAuthenticated, (req, res, next) => {
  const { tribbuId, checklistItems = [] } = req.body;

  Tribbu.findById(tribbuId)
    .then((tribbu) => {
      const userId = req.payload._id;
      if (tribbu.ownerId.toString() === userId || tribbu.members.some((m) => m.userId.toString() === userId)) {
        return Event.create({
          ...req.body,
          checklistItems,
          createdBy: userId,
        });
      }
      throw new Error("Insufficient permissions");
    })
    .then((response) => res.json(response))
    .catch((err) => {
      console.log("Error while creating an event", err);
      res.status(500).json({ error: "Error while creating an event" });
    });
});

router.get("/events", (req, res, next) => {
  const { tribbuId } = req.query;
  const filter = tribbuId ? { tribbuId } : {};

  Event.find(filter)
    .populate("tribbuId")
    .populate("childId")
    .populate("responsibles", "name email")
    .then((allEvents) => res.json(allEvents))
    .catch((err) => next(err));
});

router.get("/events/:eventId", (req, res, next) => {
  const { eventId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ error: "Invalid eventId" });
  }

  Event.findById(eventId)
    .populate("tribbuId")
    .populate("childId")
    .populate("assignedTo")
    .populate("responsibles", "name email")
    .populate("createdBy")
    .then((event) => res.status(200).json(event))
    .catch((err) => next(err));
});

router.put("/events/:eventId", isAuthenticated, checkEventRole(["GUARDIÁN", "PROTECTOR"]), (req, res, next) => {
  const { eventId } = req.params;
  const { checklistItems = [] } = req.body;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ error: "Invalid eventId" });
  }

  Event.findByIdAndUpdate(
    eventId,
    { ...req.body, checklistItems },
    { new: true }
  )
    .populate("childId")
    .populate("responsibles", "name email")
    .then((updatedEvent) => res.json(updatedEvent))
    .catch((err) => next(err));
});

router.delete("/events/:eventId", isAuthenticated, checkEventRole(["GUARDIÁN"]), (req, res, next) => {
  const { eventId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ error: "Invalid eventId" });
  }

  Event.findByIdAndDelete(eventId)
    .then(() => res.json({ message: "Event deleted" }))
    .catch((err) => next(err));
});

module.exports = router;
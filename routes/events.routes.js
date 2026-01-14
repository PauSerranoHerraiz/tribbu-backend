const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Event = require("../models/Event.model");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

router.post("/events", isAuthenticated, (req, res, next) => {

  Event.create(req.body)
    .then((response) => res.json(response))
    .catch((err) => {
      console.log("Error while creating an event", err);
      res.status(500).json({ error: "Error while creating an event" });
    });
});

router.get("/events", (req, res, next) => {
  Event.find()
    .populate("User")
    .then((allEvents) => res.json(allEvents))
    .catch((err) => {
      console.log("Error while getting the event", err);
      res.status(500).json({ error: "Error while getting the event" });
    });
});

router.get("/events/:eventId", (req, res, next) => {
  const { tribbuId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    res.status(400).json({ error: "Specified id is not valid" });
    return;
  }

  Event.findById(eventId)
    .populate("User")
    .then((event) => res.status(200).json(event))
    .catch((err) => {
      console.log("Error while retrieving an event", err);
      res.status(500).json({ error: "Error while retrieving an event" });
    });
});

router.put("/events/:eventId", isAuthenticated, (req, res, next) => {
  const { eventId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    res.status(400).json({ error: "Specified id is not valid" });
    return;
  }

  Event.findByIdAndUpdate(eventId, req.body, { new: true })
    .then((updatedEvent) => res.json(updatedEvent))
    .catch((err) => {
      console.log("Error while updating an event", err);
      res.status(500).json({ error: "Error while updating an event" });
    });
});

router.delete("/events/:eventId", isAuthenticated, (req, res, next) => {
  const { eventId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    res.status(400).json({ error: "Specified id is not valid" });
    return;
  }

  Event.findByIdAndRemove(eventId)
    .then(() =>
      res.json({
        message: `Event with ${eventId} is removed successfully.`,
      })
    )
    .catch((err) => {
      console.log("Error while deleting an event", err);
      res.status(500).json({ error: "Error while deleting an event" });
    });
});

module.exports = router;

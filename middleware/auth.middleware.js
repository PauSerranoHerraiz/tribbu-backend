const Tribbu = require("../models/Tribbu.model");
const Event = require("../models/Event.model");
const Child = require("../models/Child.model");

const checkTribbuRole = (requiredRoles) => {
  return async (req, res, next) => {
    try {
      const { tribbuId } = req.params;
      const userId = req.payload._id;

      const tribbu = await Tribbu.findById(tribbuId);
      if (!tribbu) {
        return res.status(404).json({ error: "Tribbu not found" });
      }

      if (tribbu.ownerId.toString() === userId) {
        return next();
      }

      const member = tribbu.members.find(m => m.userId.toString() === userId);
      if (!member || !requiredRoles.includes(member.role)) {
        return res.status(403).json({ error: "Insufficient permissions" });
      }

      next();
    } catch (err) {
      res.status(500).json({ error: "Authorization error" });
    }
  };
};

const checkEventRole = (requiredRoles) => {
  return async (req, res, next) => {
    try {
      const { eventId } = req.params;
      const userId = req.payload._id;

      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      const tribbuId = event.tribbuId;
      const tribbu = await Tribbu.findById(tribbuId);
      if (!tribbu) {
        return res.status(404).json({ error: "Associated Tribbu not found" });
      }

      if (tribbu.ownerId.toString() === userId) {
        return next();
      }

      const member = tribbu.members.find(m => m.userId.toString() === userId);
      if (!member || !requiredRoles.includes(member.role)) {
        return res.status(403).json({ error: "Insufficient permissions" });
      }

      next();
    } catch (err) {
      res.status(500).json({ error: "Authorization error" });
    }
  };
};

const checkChildRole = (requiredRoles) => {
  return async (req, res, next) => {
    try {
      const { childId } = req.params;
      const userId = req.payload._id;

      const child = await Child.findById(childId);
      if (!child) {
        return res.status(404).json({ error: "Child not found" });
      }

      const tribbuId = child.tribbuId;
      const tribbu = await Tribbu.findById(tribbuId);
      if (!tribbu) {
        return res.status(404).json({ error: "Associated Tribbu not found" });
      }

      if (tribbu.ownerId.toString() === userId) {
        return next();
      }

      const member = tribbu.members.find(m => m.userId.toString() === userId);
      if (!member || !requiredRoles.includes(member.role)) {
        return res.status(403).json({ error: "Insufficient permissions" });
      }

      next();
    } catch (err) {
      res.status(500).json({ error: "Authorization error" });
    }
  };
};

module.exports = { checkTribbuRole, checkEventRole, checkChildRole };
const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

router.get("/notifications", isAuthenticated, async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.payload._id,
    })
      .populate("tribbuId", "name")
      .populate("eventId", "title")
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get(
  "/notifications/tribbu/:tribbuId",
  isAuthenticated,
  async (req, res) => {
    try {
      const { tribbuId } = req.params;
      const notifications = await Notification.find({
        userId: req.payload._id,
        tribbuId,
      })
        .populate("tribbuId", "name")
        .populate("eventId", "title")
        .sort({ createdAt: -1 });

      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.get(
  "/notifications/unread/count",
  isAuthenticated,
  async (req, res) => {
    try {
      const count = await Notification.countDocuments({
        userId: req.payload._id,
        isRead: false,
      });

      res.json({ count });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.patch(
  "/notifications/:notificationId/read",
  isAuthenticated,
  async (req, res) => {
    try {
      const { notificationId } = req.params;
      const notification = await Notification.findByIdAndUpdate(
        notificationId,
        { isRead: true },
        { new: true }
      );

      res.json(notification);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.patch(
  "/notifications/mark-all-read",
  isAuthenticated,
  async (req, res) => {
    try {
      await Notification.updateMany(
        { userId: req.payload._id, isRead: false },
        { isRead: true }
      );

      res.json({ message: "Todas marcadas como leídas" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.delete(
  "/notifications/:notificationId",
  isAuthenticated,
  async (req, res) => {
    try {
      const { notificationId } = req.params;
      await Notification.findByIdAndDelete(notificationId);

      res.json({ message: "Notificación eliminada" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
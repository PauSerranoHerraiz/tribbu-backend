const { Schema, model } = require("mongoose");

const notificationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tribbuId: {
    type: Schema.Types.ObjectId,
    ref: "Tribbu",
  },
  eventId: {
    type: Schema.Types.ObjectId,
    ref: "Event",
  },
  type: {
    type: String,
    enum: [
      "event_created",
      "event_updated",
      "event_deleted",
      "member_joined",
      "member_left",
      "member_role_changed",
      "comment_added",
      "tribbu_updated",
    ],
    required: true,
  },
  title: String,
  message: String,
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("Notification", notificationSchema);
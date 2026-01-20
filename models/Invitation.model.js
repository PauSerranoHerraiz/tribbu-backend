const { Schema, model } = require("mongoose");

const invitationSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true
    },
    tribbuId: {
      type: Schema.Types.ObjectId,
      ref: "Tribbu",
      required: true
    },
    role: {
      type: String,
      enum: ["GUARDIÁN", "PROTECTOR", "SABIO", "CACHORRO"],
      default: "SABIO"
    },
    invitedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending"
    },
    acceptedAt: Date
  },
  { timestamps: true }
);

module.exports = model("Invitation", invitationSchema);
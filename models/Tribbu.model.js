const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const tribbuSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Tribbu name is required."],
        },
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            // required: [true, "An owner is required"]
        },
        members: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true
                },
                role: {
                    type: String,
                    enum: ["GUARDIÁN", "PROTECTOR", "SABIO", "CACHORRO"],
                    required: [true, "To set a role is required"],
                    default: "SABIO"
                },
            }
        ],
    },
    {
        timestamps: true,
    }
);

const Tribbu = model("Tribbu", tribbuSchema);

module.exports = Tribbu;

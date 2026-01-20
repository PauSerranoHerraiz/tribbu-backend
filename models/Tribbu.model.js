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
        children: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Child"
            }
        ]
    },
    {
        timestamps: true,
    }
);

const Tribbu = model("Tribbu", tribbuSchema);

module.exports = Tribbu;

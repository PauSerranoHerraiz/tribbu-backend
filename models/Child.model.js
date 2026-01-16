const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const childSchema = new Schema(
    {
        tribbuId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tribbu",
            required: [true, "Tribbu is required"]
        },
        name: {
            type: String,
            required: [true, "Child's name is required"]
        },
        birthDate: {
            type: Date
        },
        notes: {
            type: String,
        },
        role: {
            type: String,
            enum: ["CACHORRO"],
            required: [true, "To set a role is required"],
            default: "CACHORRO"
        },
    },
    {
        timestamps: true,
    }
);

const Child = model("Child", childSchema);

module.exports = Child;

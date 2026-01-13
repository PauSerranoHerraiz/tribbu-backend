const { Schema, model } = require("mongoose");

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
        }
    },
    {
        timestamps: true,
    }
);

const Child = model("Child", childSchema);

module.exports = Child;

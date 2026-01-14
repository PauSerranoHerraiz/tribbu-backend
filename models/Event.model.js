const { Schema, model, default: mongoose } = require("mongoose");

const eventSchema = new Schema(
    {
        tribbuId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tribbu",
            required: [true, "A tribbu id is required"]
        },
        childId: {
            type: mongoose.Schema.Types.ObjectId,
            red: "Child",
            required: [false, "A child id is required"]
        },
        title: {
            type: String,
            required: [true, "A title for the event is required"]
        },
        start: {
            type: Date,
            required: [true, "Start date is required"]
        },
        end: {
            type: Date,
            required: [true, "End date is required"]
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        notes: {
            type: String
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    { timestamp: true }
);

const Event = model("Event", eventSchema);

module.exports = Event;
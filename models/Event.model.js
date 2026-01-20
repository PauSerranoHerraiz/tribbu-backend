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
            ref: "Child",
            required: false
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
        responsibles: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],
        completed: {
            type: Boolean,
            default: false
        },
        notes: {
            type: String
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        checklistItems: [
            {
                text: { type: String, trim: true, required: true },
                completed: { type: Boolean, default: false },
            },
        ]
    },
    { timestamps: true }
);

const Event = model("Event", eventSchema);

module.exports = Event;
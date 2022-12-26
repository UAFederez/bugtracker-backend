const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
    versionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Version",
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Project",
    },
    reporterId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },

    title: {
        type: String,
        required: true,
        maxLength: 128,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["Pending", "In Progress", "Closed", "Resolved"],
        default: "Pending",
        required: true,
    },
    severity: {
        type: String,
        enum: ["Low", "Medium", "High"],
        required: true,
    },
    dateSubmitted: {
        type: Date,
        default: Date.now(),
        required: true,
    },
    dateUpdated: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model("Ticket", TicketSchema);

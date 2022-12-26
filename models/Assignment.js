const mongoose = require("mongoose");

const AssignmentSchema = new mongoose.Schema({
    developerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    ticketId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket",
        required: true,
    },
});

module.exports = mongoose.model("Assignment", AssignmentSchema);

const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    ticketId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket",
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    datePosted: {
        type: Date,
        default: Date.now(),
        required: true,
    },
});

module.exports = mongoose.model("Comment", CommentSchema);

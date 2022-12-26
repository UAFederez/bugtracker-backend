const mongoose = require("mongoose");

const VersionSchema = new VersionSchema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    major: {
        type: Number,
        min: 0,
        required: true,
    },
    minor: {
        type: Number,
        min: 0,
        required: true,
    },
    patch: {
        type: Number,
        min: 0,
        required: true,
    },
    releaseDate: {
        type: Date,
        default: Date.now(),
        required: true,
    },
});

module.exports = mongoose.model("Version", VersionSchema);

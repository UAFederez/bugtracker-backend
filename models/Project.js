const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: 128,
    },
    description: {
        type: String,
        maxLength: 512,
    },
});

module.exports = new mongoose.model("Project", ProjectSchema);

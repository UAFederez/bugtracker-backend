const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        maxLength: 128,
    },
    lastName: {
        type: String,
        required: true,
        maxLength: 128,
    },
    email: {
        type: String,
        required: true,
        maxLength: 100,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ["Reporter", "Developer", "Project Manager", "Admin"],
        default: ["Reporter"],
    },
});

module.exports = mongoose.model("User", UserSchema);

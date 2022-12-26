const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Read routes
router.get("/", async (request, response) => {
    try {
        const users = await User.find({});
        response.status(200).send(users);
    } catch (error) {
        response.status(500).send({
            message: "internal server error. could not retrieve users",
        });
    }
});

// Creation routes
// Users can only be created using /auth/register route

// Update routes

// Deletion routes

module.exports = router;

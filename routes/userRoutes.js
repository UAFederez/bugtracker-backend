const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// TODO:
// requireUserIsAuth to be included as middleware in all of these
// route handlers, but for testing purposes these will do for now

// Read routes
router.get("/", async (request, response) => {
    try {
        const users = await User.find({}).select(
            "_id firstName lastName email role"
        );
        response.status(200).send(users);
    } catch (error) {
        response.status(500).send({
            message: "internal server error. could not retrieve users",
        });
    }
});

router.get("/:id", async (request, response) => {
    try {
        const user = await User.findById(request.params.id).select(
            "_id firstName lastName email role"
        );
        if (!user) {
            response.status(400).send(user);
        }
        response.status(200).send(user);
    } catch (error) {
        response.status(500).send(error);
    }
});

// Creation routes
// TODO:
// Validate that the request is authenticated AND that the user
// is an admin
router.post("/new", async (request, response) => {
    try {
        const existingUser = await User.find({ email: request.body.email });

        if (existingUser) {
            response
                .status(403)
                .send({ message: "User with that email already exists" });
        }
        const hashedPassword = await bcrypt.hash(request.body.password, 10);

        const newUser = new User({
            firstName: request.body.firstName,
            lastName: request.body.lastName,
            email: request.body.email,
            password: hashedPassword,
        });

        await newUser.save();
        response.status(201).send({ message: "user successfully created " });
    } catch (error) {
        response.status(500).send(error);
    }
});

// Update routes
router.put("/update/:id", async (request, response) => {
    try {
        const user = await User.findById(request.params.id);
        if (!user) {
            response.status(404).send({ message: "Could not find user" });
        }

        if (request.body.hasOwnProperty("firstName")) {
            user.firstName = request.body.firstName;
        }
        if (request.body.hasOwnProperty("lastName")) {
            user.lastName = request.body.lastName;
        }
        if (request.body.hasOwnProperty("email")) {
            user.email = request.body.email;
        }
        if (request.body.hasOwnProperty("role")) {
            user.role = request.body.role;
        }
        await user.save();
        response.status(200).send({ user });
    } catch (error) {
        response.status(500).send(error);
    }
});

// Delete routes
router.delete("/delete/:id", async (request, response) => {
    try {
        const user = await User.findById(request.params.id);
        if (!user) {
            response.status(404).send({ message: "User does not exist" });
        } else {
            await User.deleteOne({ _id: user._id });
            response.status(200).send({ message: "sucessfully deleted User" });
        }
    } catch (error) {
        response.status(500).send(error);
    }
});

module.exports = router;

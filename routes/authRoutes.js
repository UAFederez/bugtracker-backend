const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const User = require("../models/User");

const passport = require("passport");

router.get("/currentUser", (request, response) => {
    if (request.isAuthenticated()) {
        response.status(200).send(request.user);
    } else {
        response.sendStatus(403);
    }
});

router.post("/login", (request, response, next) => {
    passport.authenticate("local", (error, user, message) => {
        if (error) {
            throw error;
        }
        if (!user) {
            response.status(403).send(message);
        } else {
            request.logIn(user, (error) => {
                if (error) {
                    throw error;
                }
                response
                    .status(200)
                    .send({ message: "successfully logged in" });
            });
        }
    })(request, response, next);
});

router.post("/register", async (request, response) => {
    try {
        const user = await User.findOne({
            email: request.body.email,
        });
        if (user) {
            response.status(403).send({ message: "user already exists" });
        } else {
            try {
                const hashedPassword = await bcrypt.hash(
                    request.body.password,
                    10
                );

                const newUser = new User({
                    firstName: request.body.firstName,
                    lastName: request.body.lastName,
                    email: request.body.email,
                    password: hashedPassword,
                });

                await newUser.save();
                response
                    .status(201)
                    .send({ message: "user successfully created " });
            } catch (error) {
                response.status(500).send(error);
            }
        }
    } catch (error) {
        response.sendStatus(500);
    }
});

module.exports = router;

if (process.env.NODE_ENV === "development") {
    require("dotenv").config();
}

const express = require("express");
const session = require("express-session");
const app = express();
const cors = require("cors");
const passport = require("passport");
const mongoose = require("mongoose");
const initializePassport = require("./passport-config");

const mongodbURI =
    process.env.NODE_ENV === "development"
        ? process.env.MONGODB_DEV_URI
        : process.env.MONGODB_PROD_URI;
<<<<<<< HEAD
=======

console.log("Connecting to:", mongodbURI);
>>>>>>> origin/main

mongoose.connect(
    mongodbURI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    () => {
        console.log("Connected to MongoDB database");
    }
);

mongoose.connection.on("error", (error) => {
    console.log(error);
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
    cors({
        origin: process.env.FRONTEND_ORIGIN,
        credentials: true,
    })
);
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            sameSite: "strict",
        },
    })
);
app.use(passport.initialize());
app.use(passport.session());

initializePassport(passport);

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const versionRoutes = require("./routes/versionRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const commentRoutes = require("./routes/commentRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");

// Initialize the routes of the api
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/versions", versionRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/assigments", assignmentRoutes);
app.use("/auth", authRoutes);

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Listening on port ${process.env.SERVER_PORT}`);
});

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

const mongodbURI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@gettingstarted.mxdv2.mongodb.net/${process.env.MONGODB_DBNAME}?retryWrites=true&w=majority`;

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

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");

// Initialize the routes of the api
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/auth", authRoutes);

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Listening on port ${process.env.SERVER_PORT}`);
});

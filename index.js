if (process.env.NODE_ENV === "development") {
    require("dotenv").config();
}

const express = require("express");
const session = require("express-session");
const app = express();
const cors = require("cors");
const passport = require("passport");

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

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Listening on port ${process.env.SERVER_PORT}`);
});

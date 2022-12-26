const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/User");

module.exports = function initializePassport(passport) {
    const authenticateUser = async (email, password, done) => {
        const user = await User.findOne({ email });
        if (!user) {
            return done(null, false, { message: "user not found" });
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, { message: "incorrect password" });
            }
        } catch (error) {
            return done(error, false);
        }
    };

    passport.use(
        new LocalStrategy(
            {
                usernameField: "email",
            },
            authenticateUser
        )
    );

    passport.serializeUser((user, done) => done(null, user._id));
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    });
};

const passport = require("passport");
const googleStretegy = require("passport-google-oauth").OAuth2Strategy;
const crypto = require("crypto");
const User = require("../models/user");

// tell passport to use a new strategy for google login
passport.use(
  new googleStretegy(
    {
      clientID:
        "clientid---.apps.googleusercontent.com",
      clientSecret: "Google Secret",
      callbackURL:
        "https://localhost/users/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          // if found, set this user as req.user
          return done(null, user);
        } else {
          // if not found, create the user and set it a new signUp user
          const newUser = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: crypto.randomBytes(20).toString("hex"),
            about: "Hi, Welcome to Node.JS Authentication App.",
          });
          return done(null, newUser);
        }
      } catch (err) {
        console.log("error in google strategy-passport", err);
        return done(err);
      }
    }
  )
);

module.exports = passport;

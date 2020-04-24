const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const keys = require("../config/keys");
const mongoose = require("mongoose");
const User = mongoose.model("users");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback",
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ googleId: profile.id });
      if (!existingUser) {
        const user = await new User({ googleId: profile.id }).save();
        done(null, user);
      } else {
        done(null, existingUser);
      }
      // console.log(`access token: ${accessToken}`);
      // console.log(`refresh token: ${refreshToken}`);
      // console.log(`profile: ${JSON.stringify(profile)}`);
    }
  )
);

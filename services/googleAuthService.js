// services/googleAuthService.js

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const TelegramSubscription = require("../models/telegramSubscriptionSchema");
const LineSubscription = require("../models/lineSubscriptionSchema");
const WebSubscription = require("../models/webSubscriptionSchema");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        let isNewUser = false;
        if (!user) {
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
          });
          await user.save();
          isNewUser = true;
        }

        // 生成 JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
          expiresIn: "1h",
        });
        user.token = token;
        await user.save();

        if (isNewUser) {
          await new TelegramSubscription({ userId: user._id }).save();
          await new LineSubscription({ userId: user._id }).save();
          await new WebSubscription({ userId: user._id }).save();
        }

        // 查詢 Telegram Id
        const telegramSubscription = await TelegramSubscription.findOne({
          userId: user._id,
        });
        const telegramId = telegramSubscription
          ? telegramSubscription.telegramId
          : null;

        done(null, { user, token, telegramId });
      } catch (error) {
        console.error("Error during Google OAuth:", error);
        done(error, false);
      }
    }
  )
);

module.exports = passport;

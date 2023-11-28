// services/lineAuthService.js

const passport = require("passport");
const LineStrategy = require("passport-line").Strategy;
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const TelegramSubscription = require("../models/telegramSubscriptionSchema");
const LineSubscription = require("../models/lineSubscriptionSchema");
const WebSubscription = require("../models/webSubscriptionSchema");
require("dotenv").config();

passport.use(
  new LineStrategy(
    {
      channelID: process.env.LINE_CLIENT_ID,
      channelSecret: process.env.LINE_CLIENT_SECRET,
      callbackURL: process.env.LINE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ lineId: profile.id });
        let isNewUser = false;
        if (!user) {
          user = new User({
            name: profile.displayName,
            email: "no-email@example.com",
            lineId: profile.id,
          });
          await user.save();
          isNewUser = true;
        }

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

        const telegramSubscription = await TelegramSubscription.findOne({
          userId: user._id,
        });
        const telegramId = telegramSubscription
          ? telegramSubscription.telegramId
          : null;

        done(null, { user, token, telegramId });
      } catch (error) {
        console.error("Error during Line OAuth:", error);
        done(error, false);
      }
    }
  )
);

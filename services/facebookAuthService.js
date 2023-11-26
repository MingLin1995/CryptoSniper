// services/facebookAuthService.js

const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const TelegramSubscription = require("../models/telegramSubscriptionSchema");
const LineSubscription = require("../models/lineSubscriptionSchema");
const WebSubscription = require("../models/webSubscriptionSchema");
require("dotenv").config();

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "https://crypto-sniper.minglin.vip/auth/facebook/callback",
      profileFields: ["id", "displayName", "emails"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ facebookId: profile.id });
        let isNewUser = false;

        if (!user) {
          user = new User({
            name: profile.displayName,
            email: "no-email@example.com",
            facebookId: profile.id,
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
        console.error("Error during Facebook OAuth:", error);
        done(error, false);
      }
    }
  )
);

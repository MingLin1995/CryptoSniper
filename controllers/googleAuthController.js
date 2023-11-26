// CryptSniper/controllers/googleAuthController.js

const TelegramSubscription = require("../models/telegramSubscriptionSchema");
const LineSubscription = require("../models/lineSubscriptionSchema");
const WebSubscription = require("../models/webSubscriptionSchema");

const googleAuthCallback = async (req, res) => {
  if (req.user) {
    const { user, token, telegramId } = req.user;
    res.redirect(
      `/?token=${token}&userId=${user._id}&telegramId=${telegramId || ""}`
    );
  } else {
    res.redirect("/login");
  }
};

module.exports = {
  googleAuthCallback,
};

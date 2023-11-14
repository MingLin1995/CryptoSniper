// controllers/trackingController.js

const PriceAlert = require("../models/PriceAlert");
const { trackPrices } = require("../services/priceAlertService.js");
const User = require("../models/User");

const addTracking = async (req, res) => {
  const { symbol, targetPrice, notificationMethod, telegramId } = req.body;
  const userId = req.user._id;
  try {
    let alertData = {
      user: userId,
      symbol,
      targetPrice,
      notificationMethod,
    };

    if (notificationMethod === "Telegram") {
      const user = await User.findById(userId);
      if (
        user &&
        user.telegramSubscription &&
        user.telegramSubscription.notificationsEnabled
      ) {
        alertData.telegramId = user.telegramSubscription.telegramId;
      } else {
        throw new Error("Telegram notifications are disabled for the user");
      }
    }

    if (notificationMethod === "Line") {
      const user = await User.findById(userId);
      if (user && user.lineSubscription && user.lineSubscription.accessToken) {
        alertData.lineAccessToken = user.lineSubscription.accessToken;
      } else {
        throw new Error("Line Access Token not found for the user");
      }
    }

    const priceAlert = new PriceAlert(alertData);
    await priceAlert.save();
    // 如果追蹤成功保存，啟動價格追蹤
    if (priceAlert) {
      trackPrices();
    }

    res.status(201).json({ message: "追蹤成功設置！", priceAlert });
  } catch (error) {
    res.status(400).json({ error: "無法設置追蹤", details: error.message });
  }
};

module.exports = { addTracking };

// controllers/trackingController.js

const PriceAlert = require("../models/PriceAlert");
const { trackPrices } = require("../services/priceAlertService.js");

const addTracking = async (req, res) => {
  const { symbol, targetPrice, notificationMethod, telegramId } = req.body;
  const userId = req.user._id; // 從 verifyToken 中間件獲取用戶ID

  try {
    let alertData = {
      user: userId,
      symbol,
      targetPrice,
      notificationMethod,
    };

    if (notificationMethod === "Telegram") {
      alertData.telegramId = telegramId; // 只有當使用 Telegram 通知時才添加
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

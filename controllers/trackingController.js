// controllers/trackingController.js

const Tracking = require("../models/Tracking");
const { trackPrices } = require("../services/priceTracker");

const addTracking = async (req, res) => {
  const { telegramId, targetSymbol, targetPrice } = req.body;

  try {
    const tracking = new Tracking({
      telegramId,
      targetSymbol,
      targetPrice,
    });

    await tracking.save();

    res.json({
      message: "追蹤設定成功",
      telegramId: tracking.telegramId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "設定追蹤時發生錯誤" });
  }
};

module.exports = { addTracking, trackPrices };

// controllers/trackingController.js

const Tracking = require("../models/Tracking");
const { trackPrices } = require("../services/priceTracker");

// 新增追踪：將用戶的追踪需求保存到資料庫
exports.addTracking = async (req, res) => {
  const { telegramId, targetSymbol, targetPrice } = req.body;

  try {
    const tracking = new Tracking({
      telegramId,
      targetSymbol,
      targetPrice,
    });

    await tracking.save();

    res.json({
      message: "追踪設定成功",
      telegramId: tracking.telegramId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "設定追踪時發生錯誤" });
  }
};

exports.trackPrices = trackPrices;

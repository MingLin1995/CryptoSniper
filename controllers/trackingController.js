// controllers/trackingController.js

const Tracking = require("../models/Tracking");
const { trackPrices } = require("../services/priceTracker");
const TargetPrice = require("../models/TargetPrice");

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

// services/setTargetPrice.js 或是其他相對應的路由處理器檔案
const setTargetPrice = async (req, res) => {
  try {
    const { symbol, targetPrice } = req.body;
    const userId = req.user._id;

    // 创建新的目标价格记录
    const newTarget = new TargetPrice({
      user: userId, // 请确保这里使用的是'user'字段，与模型定义一致
      symbol: symbol,
      targetPrice: targetPrice,
    });

    await newTarget.save(); // 保存到数据库

    res
      .status(200)
      .json({ message: "目标价格设置成功。", targetPrice: newTarget });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "设置目标价格时出错。" });
  }
};

module.exports = { addTracking, trackPrices, setTargetPrice };

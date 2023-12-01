// CryptSniper/controllers/strategyController.js

const Strategy = require("../models/strategySchema");

// 儲存策略
const saveStrategy = async (req, res) => {
  const userId = req.user._id;
  const strategyData = { ...req.body, userId };

  if (!strategyData.name || !strategyData.conditions) {
    return res.status(400).send({ success: false, message: "缺少策略資料" });
  }

  try {
    const strategy = new Strategy(strategyData);
    await strategy.save();
    res.status(201).send({ success: true, message: "策略儲存成功" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "伺服器錯誤" });
  }
};

// 取得策略
const getStrategies = async (req, res) => {
  const userId = req.user._id;

  try {
    const strategies = await Strategy.find({ userId });
    res.status(200).send({ success: true, strategies });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "伺服器錯誤" });
  }
};

// 刪除策略
const deleteStrategy = async (req, res) => {
  const strategyId = req.query.strategyId;
  try {
    const result = await Strategy.findByIdAndDelete(strategyId);
    if (!result) {
      return res.status(404).send({ success: false, message: "找不到策略" });
    }
    res.status(200).send({ success: true, message: "策略刪除成功" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "伺服器錯誤" });
  }
};

module.exports = { saveStrategy, getStrategies, deleteStrategy };

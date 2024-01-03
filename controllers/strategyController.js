// controllers/strategyController.js

const Strategy = require("../models/strategySchema");

// 儲存策略
const saveStrategy = async (req, res) => {
  const userId = req.user._id;
  const { name, conditions = [] } = req.body;

  try {
    const strategyData = {
      userId,
      name,
      conditions,
    };

    const strategy = new Strategy(strategyData);
    await strategy.save();
    res.status(200).send({ success: true, message: "策略或板塊儲存成功" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "伺服器錯誤" });
  }
};

// 取得策略
const getStrategies = async (req, res) => {
  const userId = req.user._id;

  try {
    const strategies = await Strategy.find({ userId }).sort({ order: 1 });
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
    res.status(200).send({ success: true, message: "策略刪除成功" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "伺服器錯誤" });
  }
};

// 更新排序
const updateOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const newOrder = req.body.order;

    await Strategy.updateOrder(userId, newOrder);
    res.status(200).json({ success: true, message: "策略排序更新成功" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "策略排序更新失败",
      error: error.message,
    });
  }
};

module.exports = {
  saveStrategy,
  getStrategies,
  deleteStrategy,
  updateOrder,
};

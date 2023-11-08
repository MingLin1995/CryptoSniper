// routes/subscriptionRoutes.js
const express = require("express");
const router = express.Router();
const Subscription = require("../models/Subscription");
const verifyToken = require("../auth"); // 引入驗證中間件

// POST route for saving subscription
router.post("/subscribe", verifyToken, async (req, res) => {
  try {
    // TODO: 添加输入验证
    const subscriptionData = {
      ...req.body,
      user: req.user._id,
    };
    const subscription = new Subscription(subscriptionData);
    await subscription.save();
    res.status(201).json({ message: "訂閱已保存。" });
  } catch (error) {
    console.error(error); // 开发环境中记录错误
    res.status(500).json({ error: "保存訂閱時出錯。" });
  }
});

// POST route for canceling subscription
router.post("/unsubscribe", verifyToken, async (req, res) => {
  try {
    // TODO: 添加输入验证
    const { endpoint } = req.body;
    const result = await Subscription.deleteOne({
      endpoint,
      user: req.user._id,
    });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "未找到訂閱來取消。" });
    }
    res.status(200).json({ message: "訂閱已取消。" });
  } catch (error) {
    console.error(error); // 开发环境中记录错误
    res.status(500).json({ error: "取消訂閱時出錯。" });
  }
});

module.exports = router;

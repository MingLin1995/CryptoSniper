// controllers/subscriptionController.js

const Subscription = require("../models/Subscription");

async function subscribe(req, res) {
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
    console.error(error); // 開發環境中記錄錯誤
    res.status(500).json({ error: "保存訂閱時出錯。" });
  }
}

async function unsubscribe(req, res) {
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
    console.error(error); // 開發環境中記錄錯誤
    res.status(500).json({ error: "取消訂閱時出錯。" });
  }
}

module.exports = {
  subscribe,
  unsubscribe,
};

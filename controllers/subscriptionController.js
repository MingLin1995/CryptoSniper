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

async function checkSubscription(req, res) {
  try {
    // 確保用戶已經通過身份驗證
    if (!req.user) {
      return res.status(401).json({ error: "未授權" });
    }

    // 查找與此用戶相關聯的訂閱
    const subscription = await Subscription.findOne({ user: req.user._id });

    // 如果訂閱存在，返回已訂閱的響應
    if (subscription) {
      res.json({ isSubscribed: true });
    } else {
      // 否則返回未訂閱的響應
      res.json({ isSubscribed: false });
    }
  } catch (error) {
    console.error("檢查訂閱失敗:", error);
    res.status(500).json({ error: "內部伺服器錯誤" });
  }
}

module.exports = {
  subscribe,
  unsubscribe,
  checkSubscription,
};

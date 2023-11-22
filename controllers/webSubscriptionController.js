// controllers/webSubscriptionController.js

const User = require("../models/User");

// Web通知資料儲存
async function handleSubscription(req, res) {
  try {
    const userId = req.user._id;
    const subscriptionData = req.body;

    if (!subscriptionData) {
      return res.status(400).send("缺少訂閱資料");
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("找不到用戶");
    }

    user.webSubscription = subscriptionData;
    await user.save();

    res.status(200).send("Web通知資料儲存成功");
  } catch (error) {
    console.error("Web通知資料儲存失敗:", error);
    res.status(500).send("伺服器錯誤");
  }
}

module.exports = {
  handleSubscription,
};

// controllers/webSubscriptionController.js

const User = require("../models/userSchema");
const WebSubscription = require("../models/webSubscriptionSchema");

async function handleSubscription(req, res) {
  try {
    const userId = req.user._id;
    const subscriptionData = req.body;

    const updatedSubscription = await WebSubscription.findOneAndUpdate(
      { userId },
      { ...subscriptionData, userId },
      { upsert: true, new: true }
    );

    res.status(200).send({
      message: "Web通知資料儲存成功",
      subscription: updatedSubscription,
    });
  } catch (error) {
    console.error("Web通知資料儲存失敗:", error);
    res.status(500).send("伺服器錯誤");
  }
}

module.exports = {
  handleSubscription,
};

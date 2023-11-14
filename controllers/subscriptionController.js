// controllers/subscriptionController.js

const User = require("../models/User");

async function handleSubscription(req, res) {
  try {
    const userId = req.user._id; // 或其他方法來獲取用戶 ID
    const subscriptionData = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    user.webSubscription = subscriptionData;
    await user.save();

    res.status(200).send("Subscription updated successfully");
  } catch (error) {
    console.error("Subscription update error:", error);
    res.status(500).send("Internal Server Error");
  }
}

//檢查訂閱狀態
async function checkSubscription(req, res) {
  const userId = req.user._id;
  const notificationType = req.body.notificationType;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "用户未找到" });
    }

    let isEnabled;
    switch (notificationType) {
      case "Line":
        isEnabled = user.lineSubscription.notificationsEnabled;
        break;
      case "Web":
        isEnabled = user.webSubscription.enabled;
        break;
      case "Telegram":
        isEnabled = user.telegramSubscription.notificationsEnabled;
        break;
      default:
        return res.status(400).json({ message: "未知的通知类型" });
    }

    res.json({ isEnabled });
  } catch (error) {
    console.error("检查订阅状态失败：", error);
    res.status(500).json({ message: "检查订阅状态失败" });
  }
}

//切換訂閱狀態
async function toggleSubscription(req, res) {
  const userId = req.user._id;
  const notificationType = req.body.notificationType; // 从请求体中获取通知类型

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "用户未找到" });
    }
    let isEnabled;
    switch (notificationType) {
      case "Line":
        //切換訂閱狀態
        user.lineSubscription.notificationsEnabled =
          !user.lineSubscription.notificationsEnabled;
        //當前狀態
        isEnabled = user.lineSubscription.notificationsEnabled;
        break;
      case "Web":
        //切換訂閱狀態
        user.webSubscription.enabled = !user.webSubscription.enabled;
        //當前狀態
        isEnabled = user.webSubscription.enabled;
        break;
      case "Telegram":
        //切換訂閱狀態
        user.telegramSubscription.notificationsEnabled =
          !user.telegramSubscription.notificationsEnabled;
        //當前狀態
        isEnabled = user.telegramSubscription.notificationsEnabled;
        break;
      default:
        return res.status(400).json({ message: "未知的通知类型" });
    }

    await user.save();
    res.json({ isEnabled });
  } catch (error) {
    console.error("切换订阅状态失败：", error);
    res.status(500).json({ message: "切换订阅状态失败" });
  }
}

module.exports = {
  handleSubscription,
  checkSubscription,
  toggleSubscription,
};

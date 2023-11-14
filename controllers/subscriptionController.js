// controllers/subscriptionController.js

const User = require("../models/User");

// Web通知資料儲存
async function handleSubscription(req, res) {
  try {
    const userId = req.user._id;
    const subscriptionData = req.body;

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

//檢查訂閱狀態
async function checkSubscription(req, res) {
  const userId = req.user._id;
  const notificationType = req.body.notificationType;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "找不到用戶" });
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
        return res.status(400).json({ message: "未知的通知類型" });
    }

    res.json({ isEnabled });
  } catch (error) {
    console.error("檢查訂閱狀態失敗：", error);
    res.status(500).json({ message: "檢查訂閱狀態失敗" });
  }
}

//切換訂閱狀態
async function toggleSubscription(req, res) {
  const userId = req.user._id;
  const notificationType = req.body.notificationType;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "找不到用戶" });
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
        return res.status(400).json({ message: "未知的通知類型" });
    }

    await user.save();
    res.json({ isEnabled });
  } catch (error) {
    console.error("切換訂閱狀態失敗", error);
    res.status(500).json({ message: "切換訂閱狀態失敗" });
  }
}

module.exports = {
  handleSubscription,
  checkSubscription,
  toggleSubscription,
};

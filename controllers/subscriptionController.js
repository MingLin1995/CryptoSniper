// controllers/subscriptionController.js

const WebSubscription = require("../models/webSubscriptionSchema");
const LineSubscription = require("../models/lineSubscriptionSchema");
const TelegramSubscription = require("../models/telegramSubscriptionSchema");

//檢查訂閱狀態
async function checkSubscription(req, res) {
  const userId = req.user._id;
  const notificationType = req.query.notificationType;

  try {
    let subscription;
    switch (notificationType) {
      case "Line":
        subscription = await LineSubscription.findOne({ userId });
        break;
      case "Web":
        subscription = await WebSubscription.findOne({ userId });
        break;
      case "Telegram":
        subscription = await TelegramSubscription.findOne({ userId });
        break;
      default:
        return res.status(400).json({ message: "未知的通知類型" });
    }

    if (!subscription) {
      return res.status(404).json({ message: "找不到訂閱信息" });
    }

    const isEnabled =
      notificationType === "Web"
        ? subscription.enabled
        : subscription.notificationsEnabled;
    res.json({ isEnabled });
  } catch (error) {
    console.error("檢查訂閱狀態失敗：", error);
    res.status(500).json({ message: "檢查訂閱狀態失敗" });
  }
}

//切換訂閱狀態
async function toggleSubscription(req, res) {
  const userId = req.user._id;
  const notificationType = req.query.notificationType;

  try {
    let subscription;
    switch (notificationType) {
      case "Line":
        subscription = await LineSubscription.findOne({ userId });
        break;
      case "Web":
        subscription = await WebSubscription.findOne({ userId });
        break;
      case "Telegram":
        subscription = await TelegramSubscription.findOne({ userId });
        break;
      default:
        return res.status(400).json({ message: "未知的通知類型" });
    }

    if (!subscription) {
      return res.status(404).json({ message: "找不到訂閱信息" });
    }

    // 切換訂閱狀態
    if (notificationType === "Web") {
      subscription.enabled = !subscription.enabled;
    } else {
      subscription.notificationsEnabled = !subscription.notificationsEnabled;
    }
    await subscription.save();

    res.json({
      isEnabled:
        notificationType === "Web"
          ? subscription.enabled
          : subscription.notificationsEnabled,
    });
  } catch (error) {
    console.error("切換訂閱狀態失敗", error);
    res.status(500).json({ message: "切換訂閱狀態失敗" });
  }
}

module.exports = { checkSubscription, toggleSubscription };

// services/webPushNotification.js

const webpush = require("web-push");
require("dotenv").config();
const User = require("../models/User");

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

webpush.setVapidDetails(
  "mailto:your-email@example.com",
  publicVapidKey,
  privateVapidKey
);

async function sendWebPushNotification(symbol, targetPrice, user) {
  try {
    // 從資料庫獲取最新的用戶資訊
    const updatedUser = await User.findById(user._id);
    if (!updatedUser) {
      console.log("User not found");
      return;
    }

    const userSubscription = updatedUser.webSubscription;

    // 檢查 userSubscription 和 enabled 狀態
    if (userSubscription && userSubscription.enabled) {
      const payload = JSON.stringify({
        title: `${symbol.toUpperCase()}`,
        body: `已達到目標價: ${targetPrice}`,
      });

      await webpush.sendNotification(userSubscription, payload);
    } else {
      //console.log("Web push notification is disabled for this user.");
    }
  } catch (error) {
    console.error("Error sending notification:", error);
  }
}

module.exports = sendWebPushNotification;

module.exports = sendWebPushNotification;

// services/webPushNotification.js

const webpush = require("web-push");
require("dotenv").config();
const WebSubscription = require("../models/webSubscriptionSchema");

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

webpush.setVapidDetails(
  "mailto:ben014335@gmail.com",
  publicVapidKey,
  privateVapidKey
);

async function sendWebPushNotification(symbol, targetPrice, userId) {
  try {
    // 從 WebSubscription 模型中獲取用戶的訂閱資訊
    const webSubscription = await WebSubscription.findOne({ userId });

    // 檢查訂閱和啟用狀態
    if (webSubscription && webSubscription.enabled) {
      const payload = JSON.stringify({
        title: `${symbol.toUpperCase()}`,
        body: `已達到目標價: ${targetPrice}`,
      });

      await webpush.sendNotification(webSubscription, payload);
    } else {
      //console.log("Web push notification is disabled for this user.");
    }
  } catch (error) {
    console.error("Error sending notification:", error);
  }
}

module.exports = sendWebPushNotification;

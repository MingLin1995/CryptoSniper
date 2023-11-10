// services/webPushNotification.js

const webpush = require("web-push");
require("dotenv").config();
const SubscriptionModel = require("../models/Subscription");

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

webpush.setVapidDetails(
  "mailto:your-email@example.com",
  publicVapidKey,
  privateVapidKey
);

// 推送通知
async function sendWebPushNotification(symbol, targetPrice, user) {
  const userId = user.id;
  const userSubscription = await SubscriptionModel.findOne({ user: userId });

  const payload = JSON.stringify({
    title: `${symbol.toUpperCase()}`,
    body: `已達到目標價: ${targetPrice}`,
  });
  try {
    // 發送通知
    if (userSubscription) {
      await webpush.sendNotification(userSubscription, payload);
      //console.log("Notification sent to user");
    }
  } catch (error) {
    console.error("Error sending notification:", error);
    if (error.statusCode === 410) {
      await SubscriptionModel.deleteOne({ user: userId }); // 移除無效的訂閱
      console.log(
        `Subscription for user has expired or is no longer valid. Deleted from database.`
      );
    }
  }
}

module.exports = sendWebPushNotification;

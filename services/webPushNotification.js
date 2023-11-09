// services/webPushNotification.js
const webpush = require("web-push");
require("dotenv").config();
const SubscriptionModel = require("../models/Subscription");

// 設置 web-push 相關資訊
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

  // 自定義您的通知內容
  const payload = JSON.stringify({
    title: `價格更新 - ${symbol}`,
    body: `目標價格達到: ${targetPrice}`,
  });
  try {
    // 發送通知
    if (userSubscription) {
      await webpush.sendNotification(userSubscription, payload); // 正確的函數名稱
      console.log("Notification sent to user");
    }
  } catch (error) {
    console.error("Error sending notification:", error);
    if (error.statusCode === 410) {
      // 處理訂閱無效的情況
      await SubscriptionModel.deleteOne({ user: userId }); // 移除無效的訂閱
      console.log(
        `Subscription for user has expired or is no longer valid. Deleted from database.`
      );
    }
    // 可以添加其他錯誤處理邏輯...
  }
}

module.exports = sendWebPushNotification;

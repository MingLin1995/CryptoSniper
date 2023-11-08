// services/pushService.js
const webpush = require("web-push");
const Subscription = require("../models/Subscription");
require("dotenv").config();

// 設置 web-push 相關資訊
const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

webpush.setVapidDetails(
  "mailto:your-email@example.com",
  publicVapidKey,
  privateVapidKey
);

// 推送通知
async function pushNotification(userId, symbol, currentPrice) {
  try {
    // 根據userId查詢訂閱信息
    const subscription = await Subscription.findOne({ user: userId }); // 更改查询条件为{ user: userId }
    if (!subscription) {
      throw new Error("No subscription found for the user.");
    }

    // 自定義您的通知內容
    const payload = JSON.stringify({
      title: `價格更新 - ${symbol}`,
      body: `目標價格達到: ${currentPrice}`,
    });

    // 發送通知
    await webpush.sendNotification(subscription, payload);
    console.log("Notification sent to user:", userId);
  } catch (error) {
    console.error("Error sending notification to user:", userId, error);
    if (error.statusCode === 410) {
      // 處理訂閱無效的情況
      console.log(
        `Subscription for user ${userId} has expired or is no longer valid. Deleting from database.`
      );
      await Subscription.deleteOne({ userId: userId });
    }
    // 可以添加其他錯誤處理邏輯...
  }
}

module.exports = pushNotification;

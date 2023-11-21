// services/telegramNotification.js

const axios = require("axios");
require("dotenv").config();
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const User = require("../models/User");

async function sendTelegramNotification(messageText, telegramId, user = null) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  try {
    if (user) {
      // 從資料庫獲取最新的用戶資訊
      const updatedUser = await User.findById(user._id);
      if (
        !updatedUser ||
        !updatedUser.telegramSubscription.notificationsEnabled
      ) {
        //console.log("User not found or notifications are disabled");
        return;
      }
    }

    // 發送通知
    await axios.post(url, {
      chat_id: telegramId,
      text: messageText,
    });
  } catch (error) {
    console.error("Notification error:", error);
  }
}

module.exports = sendTelegramNotification;

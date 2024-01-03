// services/telegramNotification.js

const axios = require("axios");
require("dotenv").config();
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TelegramSubscription = require("../models/telegramSubscriptionSchema");

async function sendTelegramNotification(messageText, telegramId) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  try {
    const telegramSubscription = await TelegramSubscription.findOne({
      telegramId,
    });

    if (telegramSubscription && !telegramSubscription.notificationsEnabled) {
      return;
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

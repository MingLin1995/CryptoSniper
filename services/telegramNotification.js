// services/telegramNotification.js

const axios = require("axios");
require("dotenv").config();
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

async function sendTelegramNotification(telegramId, messageText) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  try {
    const response = await axios.post(url, {
      chat_id: telegramId,
      text: messageText,
    });
  } catch (error) {
    console.error("Notification error:", error);
  }
}

module.exports = sendTelegramNotification;

// services/notificationService.js

const axios = require("axios");
require("dotenv").config();
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// 向指定的 Telegram ID 發送通知訊息
function sendNotification(telegramId, message) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  axios
    .post(url, {
      chat_id: telegramId,
      text: message,
    })
    .then((response) => {
      //console.log("Notification sent:", response.data); //發給使用者的資訊
    })
    .catch((error) => {
      console.error("Notification error:", error);
    });
}

exports.sendNotification = sendNotification;

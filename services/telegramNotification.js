// services/telegramNotification.js

const axios = require("axios");
require("dotenv").config();
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// 使用 async/await 處理異步操作
async function sendTelegramNotification(telegramId, messageText) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  try {
    const response = await axios.post(url, {
      chat_id: telegramId,
      text: messageText, // 使用傳遞進來的訊息文本
    });

    // 如果需要，處理response.data
  } catch (error) {
    // 更穩健的錯誤處理機制
    // 可以在這裡添加錯誤追蹤/記錄邏輯
    console.error("Notification error:", error);
    // 根據錯誤類型決定是否重試或採取其他措施
  }
}

module.exports = sendTelegramNotification;

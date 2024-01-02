// services/telegramBot.js

const sendTelegramNotification = require("./telegramNotification");
require("dotenv").config();

function processUpdate(data) {
  if (data.message) {
    const chatId = data.message.chat.id;
    const text = data.message.text;

    if (text === "/start") {
      const messageText = `歡迎使用 CryptoSniper 機器人！您的 Telegram ID 是 ${chatId}。`;
      sendTelegramNotification(messageText, chatId);
    }
  }
}

module.exports = { processUpdate };

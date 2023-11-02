// services/telegramBot.js

const { sendNotification } = require("./notificationService");
require("dotenv").config();

function processUpdate(update) {
  if (update.message) {
    const chatId = update.message.chat.id;
    const text = update.message.text;

    if (text === "/start") {
      const welcomeMessage = `歡迎使用 CryptoSniper 機器人！您的 Telegram ID 是 ${chatId}。`;
      sendNotification(chatId, welcomeMessage);
    }
  }
}

module.exports = { processUpdate };

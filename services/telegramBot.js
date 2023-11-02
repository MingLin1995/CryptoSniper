// services/telegramBot.js

const { sendNotification } = require("./notificationService");
require("dotenv").config();

// 使用動態 import
const fetch = import("node-fetch").then((module) => module.default);

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`;

let lastUpdateId = 0;
let retryInterval = 3000; // 初始重試間隔

async function fetchUpdates() {
  //console.log("正在獲取更新...");
  try {
    const response = await (
      await fetch
    ).call(null, `${API_URL}?offset=${lastUpdateId + 1}`);

    if (!response.ok) {
      console.error("來自 Telegram API 的錯誤回應：", response.status);
      return;
    }

    const data = await response.json();
    //console.log("收到TG使用者數據：", data);

    data.result.forEach((update) => {
      // 檢查是否 update 包含 message 屬性
      if (update.message) {
        const chatId = update.message.chat.id;
        const text = update.message.text;

        //console.log("收到TG使用者輸入的訊息:", text);

        if (text === "/start") {
          const welcomeMessage = `歡迎使用 CryptoSniper 機器人！您的 Telegram ID 是 ${chatId}。`;
          sendNotification(chatId, welcomeMessage);
        }

        lastUpdateId = Math.max(lastUpdateId, update.update_id);
        retryInterval = 3000; // 如果成功，重置重試間隔
      }
    });
  } catch (error) {
    console.error("獲取更新時出錯：", error);
    retryInterval = Math.min(retryInterval * 2, 60000); // 最多每 60 秒重試一次
  }
}

// 每隔一段時間就去獲取更新
setInterval(fetchUpdates, 5000);

module.exports = { fetchUpdates };

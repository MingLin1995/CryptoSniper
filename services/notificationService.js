// services/notificationService.js

const sendTelegramNotification = require("./telegramNotification");
const sendWebPushNotification = require("./webPushNotification");

async function sendNotification(
  symbol,
  targetPrice,
  notificationMethod,
  telegramId,
  user
) {
  switch (notificationMethod) {
    case "Telegram":
      // 傳遞自定義的訊息文本到 sendTelegramNotification 函式
      const messageText = `${symbol} 價格達到目標價：${targetPrice}`;
      await sendTelegramNotification(telegramId, messageText);
      break;
    case "Web":
      await sendWebPushNotification(symbol, targetPrice, user);
      break;
    // 您可以在這裡添加更多的通知類型
    default:
      throw new Error(`Unsupported notification type: ${notificationMethod}`);
  }
}

module.exports = sendNotification; // 更正導出語句

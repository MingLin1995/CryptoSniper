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
      const messageText = `${symbol.toUpperCase()} 已達到目標價：${targetPrice}`;
      await sendTelegramNotification(telegramId, messageText);
      break;
    case "Web":
      await sendWebPushNotification(symbol, targetPrice, user);
      break;
    default:
      throw new Error(`Unsupported notification type: ${notificationMethod}`);
  }
}

module.exports = sendNotification;

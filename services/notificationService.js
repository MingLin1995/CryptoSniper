// services/notificationService.js

const sendTelegramNotification = require("./telegramNotification");
const sendWebPushNotification = require("./webPushNotification");
const sendLineNotification = require("./lineNotification");

async function sendNotification(
  symbol,
  targetPrice,
  notificationMethod,
  telegramId,
  user,
  lineAccessToken
) {
  switch (notificationMethod) {
    case "Telegram":
      const messageText = `${symbol.toUpperCase()} 已達到目標價：${targetPrice}`;
      await sendTelegramNotification(telegramId, messageText);
      break;
    case "Web":
      await sendWebPushNotification(symbol, targetPrice, user);
      break;
    case "Line":
      if (user.lineNotificationsEnabled) {
        await sendLineNotification(symbol, targetPrice, lineAccessToken);
      }
      break;
    default:
      throw new Error(`Unsupported notification type: ${notificationMethod}`);
  }
}

module.exports = sendNotification;

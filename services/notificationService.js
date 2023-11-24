// services/notificationService.js

const sendTelegramNotification = require("./telegramNotification");
const sendWebPushNotification = require("./webPushNotification");
const sendLineNotification = require("./lineNotification");
const TelegramSubscription = require("../models/telegramSubscriptionSchema");
const LineSubscription = require("../models/lineSubscriptionSchema");
const WebSubscription = require("../models/webSubscriptionSchema");

async function sendNotification(
  symbol,
  targetPrice,
  notificationMethod,
  userId
) {
  switch (notificationMethod) {
    case "Telegram":
      const messageText = `${symbol.toUpperCase()} 已達到目標價：${targetPrice}`;
      const telegramSubscription = await TelegramSubscription.findOne({
        userId,
      });
      if (telegramSubscription && telegramSubscription.notificationsEnabled) {
        await sendTelegramNotification(
          messageText,
          telegramSubscription.telegramId,
          userId
        );
      }
      break;
    case "Web":
      const webSubscription = await WebSubscription.findOne({
        userId,
      });
      if (webSubscription && webSubscription.enabled) {
        await sendWebPushNotification(symbol, targetPrice, userId);
      }
      break;
    case "Line":
      const lineSubscription = await LineSubscription.findOne({
        userId,
      });
      if (lineSubscription && lineSubscription.notificationsEnabled) {
        await sendLineNotification(symbol, targetPrice, userId);
      }
      break;
    default:
      throw new Error(`Unsupported notification type: ${notificationMethod}`);
  }
}

module.exports = sendNotification;

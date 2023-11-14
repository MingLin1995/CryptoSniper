// services/notificationService.js

const sendTelegramNotification = require("./telegramNotification");
const sendWebPushNotification = require("./webPushNotification");
const sendLineNotification = require("./lineNotification");
const User = require("../models/User");

async function sendNotification(symbol, targetPrice, notificationMethod, user) {
  switch (notificationMethod) {
    case "Telegram":
      const messageText = `${symbol.toUpperCase()} 已達到目標價：${targetPrice}`;
      const updatedUser = await User.findById(user._id);
      const userSubscription = updatedUser.telegramSubscription;
      const telegramId = userSubscription.telegramId;

      await sendTelegramNotification(messageText, telegramId, user);
      break;
    case "Web":
      await sendWebPushNotification(symbol, targetPrice, user);
      break;
    case "Line":
      await sendLineNotification(symbol, targetPrice, user);
      break;
    default:
      throw new Error(`Unsupported notification type: ${notificationMethod}`);
  }
}

module.exports = sendNotification;

// services/lineNotification.js

const axios = require("axios");
const LineSubscription = require("../models/lineSubscriptionSchema");

async function sendLineNotification(symbol, targetPrice, userId) {
  try {
    const lineSubscription = await LineSubscription.findOne({
      userId,
    });

    if (!lineSubscription) {
      console.log("Line subscription not found");
      return;
    }

    if (lineSubscription.notificationsEnabled) {
      const message = `${symbol.toUpperCase()}－已達到目標價：${targetPrice}`;
      await axios.post(
        "https://notify-api.line.me/api/notify",
        `message=${encodeURIComponent(message)}`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${lineSubscription.accessToken}`,
          },
        }
      );
    }
  } catch (error) {
    console.error("Error sending Line message:", error);
  }
}

module.exports = sendLineNotification;

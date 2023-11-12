// services/lineNotification.js

const axios = require("axios");

async function sendLineNotification(symbol, targetPrice, lineAccessToken) {
  try {
    const message = `${symbol.toUpperCase()}－已達到目標價：${targetPrice}`;
    const response = await axios.post(
      "https://notify-api.line.me/api/notify",
      {
        message: message,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${lineAccessToken}`,
        },
      }
    );

    console.log("Message sent successfully:", response.data);
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

module.exports = sendLineNotification;

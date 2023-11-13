// services/lineNotification.js

const axios = require("axios");
const User = require("../models/User");

async function sendLineNotification(symbol, targetPrice, user) {
  try {
    // 從資料庫獲取最新的用戶資訊
    const updatedUser = await User.findById(user._id);

    if (!updatedUser) {
      console.log("User not found");
      return;
    }

    const userSubscription = updatedUser.lineSubscription;
    console.log(userSubscription);
    if (userSubscription && userSubscription.notificationsEnabled) {
      console.log(userSubscription.notificationsEnabled);
      const message = `${symbol.toUpperCase()}－已達到目標價：${targetPrice}`;
      const response = await axios.post(
        "https://notify-api.line.me/api/notify",
        {
          message: message,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${user.lineSubscription.accessToken}`,
          },
        }
      );
      //console.log("Message sent successfully:", response.data);
    }
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

module.exports = sendLineNotification;

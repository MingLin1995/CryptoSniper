// controllers/lineNotifyController.js

const axios = require("axios");
const LineSubscription = require("../models/lineSubscriptionSchema");
require("dotenv").config();

async function handleLineNotifyCallback(req, res) {
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const redirectUri = "https://crypto-sniper.minglin.vip/line-notify-callback";
  const code = req.query.code;
  const state = req.query.state;
  const parts = state.split("|");
  const userId = parts[parts.length - 1];
  try {
    // 使用授權碼獲取 Access Token
    const response = await axios.post(
      "https://notify-bot.line.me/oauth/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = response.data.access_token;

    //根據ID將lineAccessToken存入資料庫
    const lineSubscription = await LineSubscription.findOneAndUpdate(
      { userId: userId },
      {
        accessToken: accessToken,
        notificationsEnabled: true,
      },
      { new: true, upsert: true }
    );

    res.redirect("https://crypto-sniper.minglin.vip/");
  } catch (error) {
    console.error("Error getting access token:", error);
    res.status(500).json({ error: "獲取 Access Token 時出錯。" });
  }
}

module.exports = handleLineNotifyCallback;

// controllers/userController.js

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const TelegramSubscription = require("../models/telegramSubscriptionSchema");
const LineSubscription = require("../models/lineSubscriptionSchema");
const WebSubscription = require("../models/webSubscriptionSchema");
require("dotenv").config();

const secretKey = process.env.JWT_SECRET_KEY;

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "所有欄位都要填寫資料" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email 已經被註冊了" });
    }

    const user = new User({ name, email, password });
    await user.save();

    const newTelegramSubscription = new TelegramSubscription({
      userId: user._id,
    });
    await newTelegramSubscription.save();

    const newLineSubscription = new LineSubscription({
      userId: user._id,
    });
    await newLineSubscription.save();

    const newWebSubscription = new WebSubscription({
      userId: user._id,
    });
    await newWebSubscription.save();

    res.status(201).json({ message: "註冊成功" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "所有欄位都要填寫資料" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "電子信箱錯誤" });
    }

    // 如果用戶沒有密碼（透過第三登入），提示用戶用第三方登入
    if (!user.password) {
      return res
        .status(401)
        .json({ error: "已設置google或FB登入，請點選該登入按鈕" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "密碼錯誤" });
    }

    const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: "1h" });
    user.token = token;
    await user.save();

    // 查詢 Telegram ID
    const telegramSubscription = await TelegramSubscription.findOne({
      userId: user._id,
    });
    const telegramId = telegramSubscription
      ? telegramSubscription.telegramId
      : null;

    res.status(200).json({
      message: "登入成功",
      token,
      telegramId,
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      { $unset: { token: 1 } }, //移除token
      { new: true } // 更新最新的用戶資料
    );
    res.status(200).json({ message: "登出成功" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verifyToken = (req, res) => {
  res.status(200).json({ status: "success", message: "Token 驗證成功" });
};

module.exports = {
  register,
  login,
  logout,
  verifyToken,
};

// controllers/userController.js

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const secretKey = process.env.JWT_SECRET_KEY;

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "所有欄位都要填寫資料" });
    }

    // 檢查是否有用戶已經使用了該電子郵件地址
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email 已經被註冊了" });
    }

    const user = new User({ name, email, password });
    await user.save();
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

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "密碼錯誤" });
    }

    const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: "1h" });
    user.token = token;

    await user.save();

    res.status(200).json({
      message: "登入成功",
      token,
      telegramId: user.telegramId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    //根據userID找資料
    await User.findByIdAndUpdate(
      req.user._id,
      { $unset: { token: 1 } }, //移除toker
      { new: true } // 更新最新的用戶資料
    );
    res.status(200).json({ message: "登出成功" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTelegramId = async (req, res) => {
  const userId = req.user.id; // 取得當前用戶的 ID
  const { telegramId } = req.body;

  try {
    await User.findByIdAndUpdate(userId, { telegramId });
    res.json({ message: "Telegram ID 更新成功" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Telegram ID 更新失敗" });
  }
};

const verifyToken = (req, res) => {
  res.status(200).json({ status: "success", message: "Token 驗證成功" });
};

module.exports = { register, login, logout, updateTelegramId, verifyToken };

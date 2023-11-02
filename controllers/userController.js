// controllers/userController.js

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 檢查是否有用戶已經使用了該電子郵件地址
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email 已經備註冊了" });
    }

    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ message: "註冊成功" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "電子信箱或密碼錯誤" });
    }
    const token = jwt.sign({ id: user._id }, "secretkey", { expiresIn: "1h" });
    user.token = token;
    await user.save();
    res.status(200).json({
      message: "Logged in successfully",
      token,
      telegramId: user.telegramId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $unset: { token: 1 } },
      { new: true }
    );
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTelegramId = async (req, res) => {
  const userId = req.user.id; // 取得當前用戶的 ID
  const { telegramId } = req.body;

  try {
    await User.findByIdAndUpdate(userId, { telegramId });
    res.json({ message: "Telegram ID updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating Telegram ID" });
  }
};

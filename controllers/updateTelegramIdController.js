// controllers/updateTelegramIdController.js

const User = require("../models/User");

const updateTelegramId = async (req, res) => {
  const userId = req.user.id; // 取得當前用戶的 ID
  const { telegramId } = req.body;

  try {
    await User.findByIdAndUpdate(userId, {
      "telegramSubscription.telegramId": telegramId,
    });
    res.json({ message: "Telegram ID 更新成功" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Telegram ID 更新失敗" });
  }
};

module.exports = {
  updateTelegramId,
};

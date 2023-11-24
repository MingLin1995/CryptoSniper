// controllers/updateTelegramIdController.js

const TelegramSubscription = require("../models/telegramSubscriptionSchema");

const updateTelegramId = async (req, res) => {
  const userId = req.user.id;
  const { telegramId } = req.body;

  try {
    const telegramSubscription = await TelegramSubscription.findOneAndUpdate(
      { userId },
      { telegramId },
      { new: true, upsert: true }
    );

    if (!telegramSubscription) {
      return res.status(404).json({ message: "無法更新 Telegram ID" });
    }

    res.json({ message: "Telegram ID 更新成功" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Telegram ID 更新失敗" });
  }
};

module.exports = {
  updateTelegramId,
};

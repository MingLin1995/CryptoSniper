// controllers/telegramBotController.js

const { processUpdate } = require("../services/telegramBot");

const processTelegramUpdate = async (req, res) => {
  try {
    const update = req.body;
    await processUpdate(update);
    res.status(200).end();
  } catch (error) {
    res.status(500).json({ message: "處理Telegram更新時發生錯誤" });
  }
};

module.exports = { processTelegramUpdate };

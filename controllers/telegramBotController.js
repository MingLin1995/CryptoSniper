// controllers/telegramBotController.js

const { processUpdate } = require("../services/telegramBot");

const processTelegramUpdate = async (req, res) => {
  try {
    const data = req.body;
    await processUpdate(data);
    res.status(200).end();
  } catch (error) {
    res.status(500).json({ message: "處理Telegram資訊時發生錯誤" });
  }
};

module.exports = { processTelegramUpdate };

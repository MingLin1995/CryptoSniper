// routes/telegramBotRoutes.js

const express = require("express");
const router = express.Router();
const telegramBotController = require("../controllers/telegramBotController");

router.post("/", telegramBotController.processTelegramUpdate);

module.exports = router;

// routes/telegramBotRoutes.js

const express = require("express");
const router = express.Router();
const telegramBotController = require("../controllers/telegramBotController");

/**
 * @swagger
 * tags:
 *   - name: 通知設定
 *     description:
 */

/**
 * @swagger
 * /telegram-updates:
 *   post:
 *     tags: [通知設定]
 *     summary: 接收 Telegram 機器人收到的訊息
 *     description: 接收從 Telegram 發送到 webhook 的訊息
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: object
 *                 properties:
 *                   chat:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 0123456789
 *                   text:
 *                     type: string
 *                     example: "/start"
 *     responses:
 *       200:
 *         description: 接收使用者資訊成功
 *       500:
 *         description: 處理 Telegram 資訊時發生錯誤
 */
router.post("/", telegramBotController.processTelegramUpdate);

module.exports = router;

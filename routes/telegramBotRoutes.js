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
 *               update_id:
 *                 type: integer
 *                 description: 更新 telegram ID
 *               message:
 *                 type: object
 *                 description: 接收到的訊息
 *     responses:
 *       200:
 *         description: 更新成功處理
 *       500:
 *         description: 處理 Telegram 更新時發生錯誤
 */

router.post("/", telegramBotController.processTelegramUpdate);

module.exports = router;

// routes/updateTelegramIdRoutes.js

const express = require("express");
const userController = require("../controllers/updateTelegramIdController");
const verifyToken = require("../auth");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: 通知設定
 *     description:
 */

/**
 * @swagger
 * /api/updateTelegramId:
 *   patch:
 *     tags: [通知設定]
 *     summary: 更新使用者的 Telegram ID
 *     description: 用於更新使用者的 Telegram ID
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - telegramId
 *             properties:
 *               telegramId:
 *                 type: string
 *                 description: 用戶要更新的 Telegram ID
 *     responses:
 *       200:
 *         description: Telegram ID 更新成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: 無法更新 Telegram ID
 *       500:
 *         description: 伺服器錯誤 或 Telegram ID 更新失敗
 */

router.patch("/", verifyToken, userController.updateTelegramId);

module.exports = router;

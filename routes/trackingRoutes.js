// routes/trackingRoutes.js

const express = require("express");
const router = express.Router();
const trackingController = require("../controllers/trackingController");
const verifyToken = require("../auth");

/**
 * @swagger
 * tags:
 *   - name: 到價通知
 *     description:
 */

/**
 * @swagger
 * /api/track:
 *   post:
 *     tags: [到價通知]
 *     summary: 建立到價通知
 *     description: 新增到價通知
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - symbol
 *               - targetPrice
 *               - notificationMethod
 *             properties:
 *               symbol:
 *                 type: string
 *                 description: 要追蹤的交易對
 *               targetPrice:
 *                 type: number
 *                 description: 目標價格
 *               notificationMethod:
 *                 type: string
 *                 description: 通知方法（如 "Telegram" 或 "Line" 或 "Web"）
 *               telegramId:
 *                 type: string
 *                 nullable: true
 *                 description: Telegram ID（如果選擇了 Telegram 通知）
 *     responses:
 *       200:
 *         description: 追蹤成功設置
 *       400:
 *         description: 缺少必要的參數
 *       404:
 *         description: 無法設置追蹤
 *       500:
 *         description: 伺服器錯誤
 */
router.post("/", verifyToken, trackingController.addTracking);

/**
 * @swagger
 * /api/track:
 *   get:
 *     tags: [到價通知]
 *     summary: 取得追蹤清單
 *     description: 根據指定的通知方法，取得追蹤清單
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: notificationMethod
 *         required: true
 *         description: 通知方法（如 "Telegram" 或 "Line" 或 "Web"）
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 成功取得追蹤清單
 *       500:
 *         description: 伺服器錯誤
 */
router.get("/", verifyToken, trackingController.getNotificationsByMethod);

/**
 * @swagger
 * /api/track:
 *   delete:
 *     tags: [到價通知]
 *     summary: 刪除特定的追蹤項目
 *     description: 根據通知ID刪除追蹤項目
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: 要刪除的通知ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 刪除成功
 *       404:
 *         description: 沒有任何通知
 *       403:
 *         description: 沒有任何通知
 *       500:
 *         description: 伺服器錯誤
 */
router.delete("/", verifyToken, trackingController.deleteNotification);

module.exports = router;

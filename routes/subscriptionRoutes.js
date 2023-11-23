// routes/subscriptionRoutes.js

const express = require("express");
const router = express.Router();
const verifyToken = require("../auth");
const {
  handleSubscription,
  checkSubscription,
  toggleSubscription,
} = require("../controllers/subscriptionController");

/**
 * @swagger
 * tags:
 *   - name: 通知狀態
 *     description:
 */

/**
 * @swagger
 * /api/subscription:
 *   get:
 *     tags: [通知狀態]
 *     summary: 查詢使用者的通知狀態
 *     description: 根據指定的通知類型，查詢使用者的通知狀態
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: notificationType
 *         required: true
 *         description: 通知類型（如 "Line"、"Web" 或 "Telegram"）
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 成功獲取訂閱狀態
 *       400:
 *         description: 未知的通知類型
 *       404:
 *         description: 找不到用戶
 *       500:
 *         description: 檢查訂閱狀態失敗
 */

router.get("/", verifyToken, checkSubscription);
/**
 * @swagger
 * /api/subscription:
 *   patch:
 *     tags: [通知狀態]
 *     summary: 切換使用者的通知狀態
 *     description: 根據指定的通知類型，切換使用者的通知狀態
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: notificationType
 *         required: true
 *         description: 通知類型（如 "Line"、"Web" 或 "Telegram"）
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 成功切換訂閱狀態
 *       400:
 *         description: 未知的通知類型
 *       404:
 *         description: 找不到用戶
 *       500:
 *         description: 切換訂閱狀態失敗
 */

router.patch("/", verifyToken, toggleSubscription);

module.exports = router;

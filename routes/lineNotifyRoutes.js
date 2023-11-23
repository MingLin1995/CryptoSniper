// CryptSniper/routes/lineNotifyRoutes.js

const express = require("express");
const router = express.Router();
const lineNotifyController = require("../controllers/lineNotifyController");

/**
 * @swagger
 * tags:
 *   - name: 通知設定
 *     description:
 */

/**
 * @swagger
 * /line-notify-callback:
 *   get:
 *     tags: [通知設定]
 *     summary: LINE Notify 授權
 *     description: 處理從 LINE Notify 授權後的回調，獲取授權碼並交換 Access Token
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         description: LINE Notify 授權後返回的授權碼
 *         schema:
 *           type: string
 *       - in: query
 *         name: state
 *         required: true
 *         description: 狀態參數
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: 成功獲取 Access Token 並導回首頁
 *       404:
 *         description: 找不到用戶
 *       500:
 *         description: 獲取 Access Token 時出錯
 */

router.get("/", lineNotifyController);

module.exports = router;

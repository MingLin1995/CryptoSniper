// routes/webSubscriptionController.js

const express = require("express");
const router = express.Router();
const verifyToken = require("../auth");
const {
  handleSubscription,
} = require("../controllers/webSubscriptionController");

/**
 * @swagger
 * tags:
 *   - name: 通知設定
 *     description:
 */

/**
 * @swagger
 * /web-subscription:
 *   post:
 *     tags: [通知設定]
 *     summary: 儲存 Web 通知訂閱資料
 *     description: 為用戶儲存 Web 通知的訂閱資料
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               endpoint:
 *                 type: string
 *                 description: 通知服務的端點 URL
 *                 example: "https://wns2-ln2p.notify.windows.com/w/?token=XXX"
 *               expirationTime:
 *                 type: string
 *                 nullable: true
 *                 description: 訂閱過期時間
 *                 example: null
 *               keys:
 *                 type: object
 *                 properties:
 *                   p256dh:
 *                     type: string
 *                     description: 用戶公鑰
 *                     example: "XXX-XXX-XXX-XXX"
 *                   auth:
 *                     type: string
 *                     description: 認證密鑰
 *                     example: "XXXX_XXX"
 *     responses:
 *       200:
 *         description: Web通知資料儲存成功
 *       500:
 *         description: 伺服器錯誤
 */

router.post("/", verifyToken, handleSubscription);

module.exports = router;

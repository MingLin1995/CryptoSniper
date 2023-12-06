// CryptSniper/routes/strategyRoutes.js

const express = require("express");
const router = express.Router();
const strategyController = require("../controllers/strategyController");
const verifyToken = require("../auth");

/**
 * @swagger
 * tags:
 *   - name: 策略清單
 *     description:
 */

/**
 * @swagger
 * /api/strategy:
 *   post:
 *     tags: [策略清單]
 *     summary: 儲存策略
 *     description: 將交易策略保存到使用者的清單中
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 策略名稱
 *               conditions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     comparison_operator_1:
 *                       type: string
 *                     comparison_operator_2:
 *                       type: string
 *                     logical_operator:
 *                       type: string
 *                     param_1:
 *                       type: number
 *                     param_2:
 *                       type: number
 *                     param_3:
 *                       type: number
 *                     param_4:
 *                       type: number
 *                     time_interval:
 *                       type: string
 *     responses:
 *       201:
 *         description: 策略儲存成功
 *       400:
 *         description: 缺少策略資料
 *       500:
 *         description: 伺服器錯誤
 */

router.post("/", verifyToken, strategyController.saveStrategy);
/**
 * @swagger
 * /api/strategy:
 *   get:
 *     tags: [策略清單]
 *     summary: 取得策略清單
 *     description: 取得用戶的策略清單
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功取得策略清單
 *       500:
 *         description: 伺服器錯誤
 */

router.get("/", verifyToken, strategyController.getStrategies);
/**
 * @swagger
 * /api/strategy:
 *   delete:
 *     tags: [策略清單]
 *     summary: 刪除策略
 *     description: 從使用者清單中刪除特定的交易策略
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: strategyId
 *         required: true
 *         description: 要刪除的策略ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 策略刪除成功
 *       404:
 *         description: 找不到策略
 *       500:
 *         description: 伺服器錯誤
 */

router.delete("/", verifyToken, strategyController.deleteStrategy);

/**
 * @swagger
 * /api/strategy/updateOrder:
 *   patch:
 *     tags: [策略清單]
 *     summary: 更新策略清單
 *     description: 更新使用者的策略清單順序
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               order:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 策略的新順序，包含策略ID
 *     responses:
 *       200:
 *         description: 策略清單更新成功
 *       400:
 *         description: 缺少必要的查詢參數
 *       500:
 *         description: 伺服器錯誤
 */
router.patch("/updateOrder", verifyToken, strategyController.updateOrder);

module.exports = router;

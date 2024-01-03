// routes/strategyRoutes.js

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
 *                 example: "交易策略一"
 *               conditions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     time_interval:
 *                       type: string
 *                       description: 時間間隔，如 '15m', '1h', '4h', '1d'
 *                       example: "1h"
 *                     param_1:
 *                       type: number
 *                       description: 第一個參數值
 *                       example: 25
 *                     param_2:
 *                       type: number
 *                       description: 第二個參數值
 *                       example: 50
 *                     param_3:
 *                       type: number
 *                       description: 第三個參數值
 *                       example: 75
 *                     param_4:
 *                       type: number
 *                       description: 第四個參數值
 *                       example: 100
 *                     comparison_operator_1:
 *                       type: string
 *                       description: 第一個比較運算符
 *                       example: ">"
 *                     comparison_operator_2:
 *                       type: string
 *                       description: 第二個比較運算符
 *                       example: "<"
 *                     logical_operator:
 *                       type: string
 *                       description: 邏輯運算符，如 'and', 'or'
 *                       example: "and"
 *     responses:
 *       200:
 *         description: 策略儲存成功
 *       500:
 *         description: 伺服器錯誤
 */
router.post("/", verifyToken, strategyController.saveStrategy);

/**
 * @swagger
 * /api/strategy:
 *   get:
 *     tags:
 *       - 策略清單
 *     summary: 取得策略清單
 *     description: 取得用戶的策略清單
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功取得策略清單
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 strategies:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       userId:
 *                         type: string
 *                       name:
 *                         type: string
 *                       conditions:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             time_interval:
 *                               type: string
 *                             param_1:
 *                               type: number
 *                             param_2:
 *                               type: number
 *                             param_3:
 *                               type: number
 *                             param_4:
 *                               type: number
 *                             comparison_operator_1:
 *                               type: string
 *                             comparison_operator_2:
 *                               type: string
 *                             logical_operator:
 *                               type: string
 *                             _id:
 *                               type: string
 *                       __v:
 *                         type: number
 *                       order:
 *                         type: number
 *             examples:
 *               example1:
 *                 value:
 *                   success: true
 *                   strategies:
 *                     - _id: "XXXXX"
 *                       userId: "XXXXX"
 *                       name: "section:做多策略"
 *                       conditions: []
 *                       __v: 0
 *                       order: 0
 *                     - _id: "XXXXX"
 *                       userId: "XXXXX"
 *                       name: "強勢標的（15分鐘）"
 *                       conditions:
 *                         - time_interval: "15m"
 *                           param_1: 25
 *                           param_2: 60
 *                           param_3: 70
 *                           param_4: 99
 *                           comparison_operator_1: ">"
 *                           comparison_operator_2: ">"
 *                           logical_operator: "and"
 *                           _id: "XXXXX"
 *                       __v: 0
 *                       order: 1
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
 *           example: "XXXXX"
 *     responses:
 *       200:
 *         description: 策略刪除成功
 *       500:
 *         description: 伺服器錯誤
 */
router.delete("/", verifyToken, strategyController.deleteStrategy);

/**
 * @swagger
 * /api/strategy:
 *   put:
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
 *                 description: 依據策略ID，更新新的策略順序
 *                 example: ["xxxxx1", "xxxxx2", "xxxxx3"]
 *     responses:
 *       200:
 *         description: 策略清單更新成功
 *       500:
 *         description: 伺服器錯誤
 */
router.put("/", verifyToken, strategyController.updateOrder);

module.exports = router;

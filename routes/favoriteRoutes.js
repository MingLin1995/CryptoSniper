// routes/favoriteRoutes.js

const express = require("express");
const favoriteController = require("../controllers/favoriteController");
const verifyToken = require("../auth");

const router = express.Router();
/**
 * @swagger
 * tags:
 *   - name: 追蹤清單
 */

/**
 * @swagger
 * /api/favorite:
 *   post:
 *     tags: [追蹤清單]
 *     summary: 加入追蹤清單
 *     description: 將標的加入使用者的追蹤清單
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - symbol
 *             properties:
 *               userId:
 *                 type: string
 *                 description: 用戶ID
 *               symbol:
 *                 type: string
 *                 description: 要追蹤的標的符號
 *     responses:
 *       200:
 *         description: 追蹤成功
 *       400:
 *         description: 缺少參數
 *       500:
 *         description: 伺服器錯誤
 */
router.post("/", verifyToken, favoriteController.favoriteAdd);

/**
 * @swagger
 * /api/favorite:
 *   delete:
 *     tags: [追蹤清單]
 *     summary: 移除追蹤清單
 *     description: 從使用者的追蹤清單中移除標的
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         description: 用戶ID
 *         schema:
 *           type: string
 *       - in: query
 *         name: symbol
 *         required: true
 *         description: 要移除的標的
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 移除成功
 *       400:
 *         description: 缺少參數
 *       404:
 *         description: 用戶未設置追蹤清單
 *       500:
 *         description: 伺服器錯誤
 */
router.delete("/", verifyToken, favoriteController.favoriteRemove);

/**
 * @swagger
 * /api/favorite:
 *   get:
 *     tags: [追蹤清單]
 *     summary: 查詢追蹤清單
 *     description: 取得使用者的追蹤清單
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 獲取追蹤清單成功
 *       404:
 *         description: 用戶未設置追蹤清單
 *       500:
 *         description: 伺服器錯誤
 */
router.get("/", verifyToken, favoriteController.favoriteList);

/**
 * @swagger
 * /api/favorite:
 *   patch:
 *     tags: [追蹤清單]
 *     summary: 更新追蹤清單
 *     description: 更新使用者的追蹤清單順序
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
 *                 description: 追蹤清單的新順序，包含清單項目的ID
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: 追蹤清單更新成功
 *       400:
 *         description: 缺少必要的查詢參數或參數格式不正確
 *       404:
 *         description: 找不到追蹤清單或用戶
 *       500:
 *         description: 伺服器錯誤
 */
router.patch("/updateOrder", verifyToken, favoriteController.updateOrder);

module.exports = router;

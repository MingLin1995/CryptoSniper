// routes/klinesDataRoutes.js

const express = require("express");
const router = express.Router();
const klinesDataController = require("../controllers/klinesDataController");

/**
 * @swagger
 * tags:
 *   - name: 取得標的資料
 *     description:
 */

/**
 * @swagger
 * /api/loadKlinesData:
 *   get:
 *     tags: [取得標的資料]
 *     summary: 取得K線資料
 *     description: 根據時間週期，取得K線資料。
 *     parameters:
 *       - in: query
 *         name: intervals
 *         required: true
 *         description: 要取得數據的時間週期，例如："15m", "1h", "4h", "1d" 等值。
 *         schema:
 *           type: string
 *           example: '["15m", "1h", "4h", "1d"]'
 *     responses:
 *       200:
 *         description: 成功取得K線資料
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 '15m':
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TradingPairData'
 *                 '1h':
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TradingPairData'
 *                 '4h':
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TradingPairData'
 *                 '1d':
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TradingPairData'
 *       400:
 *         description: 查詢參數無效
 *       404:
 *         description: 找不到K線資料
 *       500:
 *         description: 伺服器錯誤
 *
 * components:
 *   schemas:
 *     TradingPairData:
 *       type: object
 *       properties:
 *         BTCUSDT:
 *           type: object
 *           properties:
 *             closePrices:
 *               type: array
 *               items:
 *                 type: number
 *                 description: 收盤價數組
 */

router.get("/", klinesDataController.handleLoadKlinesDataRequest);

module.exports = router;

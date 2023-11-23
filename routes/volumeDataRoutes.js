// routes/volumeDataRoutes.js

const express = require("express");
const router = express.Router();
const volumeDataController = require("../controllers/volumeDataController");

/**
 * @swagger
 * tags:
 *   - name: 取得標的資料
 *     description:
 */

/**
 * @swagger
 * /api/loadVolumeData:
 *   get:
 *     tags: [取得標的資料]
 *     summary: 取得成交量資料
 *     description: 根據交易對取得成交量資料。
 *     parameters:
 *       - in: query
 *         name: results
 *         required: true
 *         description: 要取得成交量數據的交易對。例如："BTCUSDT", "ETHUSDT", "BNBUSDT"等值。
 *         schema:
 *           type: string
 *           example: '["BTCUSDT", "ETHUSDT", "BNBUSDT"]'
 *     responses:
 *       200:
 *         description: 成功取得成交量資料
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   symbol:
 *                     type: string
 *                   quote_volume:
 *                     type: string
 *       400:
 *         description: 查詢參數無效
 *       404:
 *         description: 找不到成交量資料
 *       500:
 *         description: 伺服器錯誤
 */

router.get("/", volumeDataController.handleLoadVolumeRequest);

module.exports = router;

const express = require("express");
const router = express.Router();

// 引入專用於 Klines 數據的控制器
const klinesDataController = require("../controllers/klinesDataController");

// 引入專用於 Volume 數據的控制器
const volumeDataController = require("../controllers/volumeDataController");

// 處理請求載入 Klines 數據的路由
router.post(
  "/loadKlinesData",
  klinesDataController.handleLoadKlinesDataRequest
);

// 處理請求載入 Volume 數據的路由
router.post("/loadVolumeData", volumeDataController.handleLoadVolumeRequest);

module.exports = router;

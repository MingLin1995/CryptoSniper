// routes/trackingRoutes.js

const express = require("express");
const router = express.Router();
const trackingController = require("../controllers/trackingController");
const verifyToken = require("../auth"); // 引入驗證中間件

router.post("/", trackingController.addTracking);
// 假設您已經有了相應的middleware和controller設置
router.post("/Notification", verifyToken, trackingController.setTargetPrice);

module.exports = router;

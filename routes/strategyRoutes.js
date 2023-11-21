// CryptSniper/routes/strategyRoutes.js

const express = require("express");
const router = express.Router();
const strategyController = require("../controllers/strategyController");
const verifyToken = require("../auth");

//儲存策略
router.post("/", verifyToken, strategyController.saveStrategy);
router.get("/", verifyToken, strategyController.getStrategies);
router.delete("/", verifyToken, strategyController.deleteStrategy);

module.exports = router;

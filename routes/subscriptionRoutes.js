// routes/subscriptionRoutes.js

const express = require("express");
const router = express.Router();
const verifyToken = require("../auth");
const {
  subscribe,
  unsubscribe,
  checkSubscription,
} = require("../controllers/subscriptionController");

// 現在 "/subscribe" 和 "/unsubscribe" 路徑前會自動添加 "/api/subscription"
router.post("/subscribe", verifyToken, subscribe);
router.post("/unsubscribe", verifyToken, unsubscribe);
router.get("/check", verifyToken, checkSubscription);

module.exports = router;

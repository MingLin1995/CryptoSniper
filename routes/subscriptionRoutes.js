// routes/subscriptionRoutes.js

const express = require("express");
const router = express.Router();
const verifyToken = require("../auth");
const {
  subscribe,
  unsubscribe,
  checkSubscription,
} = require("../controllers/subscriptionController");

router.post("/subscribe", verifyToken, subscribe);
router.post("/unsubscribe", verifyToken, unsubscribe);
router.get("/check", verifyToken, checkSubscription);

module.exports = router;

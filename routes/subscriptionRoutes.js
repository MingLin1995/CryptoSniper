// routes/subscriptionRoutes.js

const express = require("express");
const router = express.Router();
const verifyToken = require("../auth");
const {
  handleSubscription,
  checkSubscription,
  toggleSubscription,
} = require("../controllers/subscriptionController");

router.post("/subscribe", verifyToken, handleSubscription);
router.post("/check", verifyToken, checkSubscription);
router.post("/toggle", verifyToken, toggleSubscription);

module.exports = router;

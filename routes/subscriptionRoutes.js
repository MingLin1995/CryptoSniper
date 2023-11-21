// routes/subscriptionRoutes.js

const express = require("express");
const router = express.Router();
const verifyToken = require("../auth");
const {
  handleSubscription,
  checkSubscription,
  toggleSubscription,
} = require("../controllers/subscriptionController");

router.post("/", verifyToken, handleSubscription);
router.get("/", verifyToken, checkSubscription);
router.patch("/", verifyToken, toggleSubscription);

module.exports = router;

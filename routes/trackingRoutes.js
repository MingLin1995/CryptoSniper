// routes/trackingRoutes.js

const express = require("express");
const router = express.Router();
const trackingController = require("../controllers/trackingController");
const verifyToken = require("../auth");

router.post("/", verifyToken, trackingController.addTracking);
router.get("/", verifyToken, trackingController.getNotificationsByMethod);
router.delete("/", verifyToken, trackingController.deleteNotification);

module.exports = router;

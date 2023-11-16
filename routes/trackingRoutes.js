// routes/trackingRoutes.js

const express = require("express");
const router = express.Router();
const trackingController = require("../controllers/trackingController");
const verifyToken = require("../auth");

router.post("/", verifyToken, trackingController.addTracking);
router.post("/load", verifyToken, trackingController.getNotificationsByMethod);
router.post("/delete", verifyToken, trackingController.deleteNotification);

module.exports = router;

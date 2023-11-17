// routes/volumeDataRoutes.js

const express = require("express");
const router = express.Router();
const volumeDataController = require("../controllers/volumeDataController");

router.get("/", volumeDataController.handleLoadVolumeRequest);

module.exports = router;

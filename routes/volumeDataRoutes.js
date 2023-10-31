// routes/volumeDataRoutes.js

const express = require("express");
const router = express.Router();
const volumeDataController = require("../controllers/volumeDataController");

router.post("/", volumeDataController.handleLoadVolumeRequest);

module.exports = router;

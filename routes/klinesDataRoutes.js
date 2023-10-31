// routes/klinesDataRoutes.js

const express = require("express");
const router = express.Router();
const klinesDataController = require("../controllers/klinesDataController");

router.post("/", klinesDataController.handleLoadKlinesDataRequest);

module.exports = router;

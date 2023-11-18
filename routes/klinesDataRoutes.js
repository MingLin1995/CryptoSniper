// routes/klinesDataRoutes.js

const express = require("express");
const router = express.Router();
const klinesDataController = require("../controllers/klinesDataController");

router.get("/", klinesDataController.handleLoadKlinesDataRequest);

module.exports = router;

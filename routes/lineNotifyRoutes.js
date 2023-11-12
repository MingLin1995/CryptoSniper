// CryptSniper/routes/lineNotifyRoutes.js

const express = require("express");
const router = express.Router();
const lineNotifyController = require("../controllers/lineNotifyController");

router.get("/", lineNotifyController);

module.exports = router;

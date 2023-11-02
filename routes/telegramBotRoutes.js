// routes/telegramBotRoutes.js

const express = require("express");
const router = express.Router();
const { processUpdate } = require("../services/telegramBot");

router.post("/", async (req, res) => {
  const data = req.body;
  data.result && data.result.forEach(processUpdate);

  res.status(200).end();
});

module.exports = router;

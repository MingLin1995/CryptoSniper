// routes/telegramBotRoutes.js

const express = require("express");
const router = express.Router();
const { processUpdate } = require("../services/telegramBot");

router.post("/", async (req, res) => {
  const update = req.body;
  processUpdate(update);

  res.status(200).end();
});

module.exports = router;

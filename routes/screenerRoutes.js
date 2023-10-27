// routes/screenerRoutes.js
const express = require("express");
const router = express.Router();

// POST 請求處理器，用於接收JSON數據
router.post("/screener", (req, res) => {
  const intervalData = req.body;
  console.log(intervalData);

  res.status(201).json({ message: "成功接收和處理 intervalData" });
});

module.exports = router;

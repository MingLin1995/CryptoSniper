// controllers/klinesDataController

const loadKlinesData = require("../models/loadKlinesData");

async function handleLoadKlinesDataRequest(req, res) {
  try {
    intervalData = JSON.parse(req.query.intervals);
  } catch (error) {
    return res.status(400).json({ message: "無效的查詢參數" });
  }

  try {
    const allKlinesData = await loadKlinesData.getKlinesData(intervalData);
    if (!allKlinesData) {
      return res.status(404).json({ message: "找不到K線資料" });
    }
    res.status(200).json(allKlinesData);
  } catch (error) {
    res.status(500).json({ message: "伺服器錯誤", error: error.message });
  }
}

module.exports = { handleLoadKlinesDataRequest };

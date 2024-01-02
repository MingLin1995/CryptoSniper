// controllers/klinesDataController

const loadKlinesData = require("../models/loadKlinesData");

async function handleLoadKlinesDataRequest(req, res) {
  intervalData = JSON.parse(req.query.intervals);

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

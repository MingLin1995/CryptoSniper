// controllers/klinesDataController

const loadKlinesData = require("../models/loadKlinesData");

async function handleLoadKlinesDataRequest(req, res) {
  const intervalData = JSON.parse(req.query.intervals);

  try {
    const allKlinesData = await loadKlinesData.getKlinesData(intervalData);
    res.status(200).json(allKlinesData);
  } catch (error) {
    res.status(500).json({ message: "發生錯誤" });
  }
}

module.exports = { handleLoadKlinesDataRequest };

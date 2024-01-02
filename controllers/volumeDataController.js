// controllers/volumeDataController.js

const loadVolumeData = require("../models/loadVolumeData");

async function handleLoadVolumeRequest(req, res) {
  let results;
  results = JSON.parse(req.query.results);

  try {
    const allVolumeData = await loadVolumeData.getVolumeData(results);
    if (!allVolumeData) {
      return res.status(404).json({ message: "找不到成交量資訊" });
    }
    res.status(200).json(allVolumeData);
  } catch (error) {
    res.status(500).json({ message: "伺服器錯誤", error: error.message });
  }
}

module.exports = { handleLoadVolumeRequest };

// controllers/volumeDataController.js

const loadVolumeData = require("../models/loadVolumeData");

async function handleLoadVolumeRequest(req, res) {
  const results = JSON.parse(req.query.results);
  try {
    const allVolumeData = await loadVolumeData.getVolumeData(results);
    res.status(200).json(allVolumeData);
  } catch (error) {
    res.status(500).json({ message: "發生錯誤" });
  }
}

module.exports = { handleLoadVolumeRequest };

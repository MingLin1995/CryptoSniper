// controllers/volumeDataController.js

const loadVolumeData = require("../models/loadVolumeData");

async function handleLoadVolumeRequest(req, res) {
  const results = req.body;
  try {
    const allVolumeData = await loadVolumeData.getVolumeData(results);
    res.status(200).json(allVolumeData);
  } catch (error) {
    res.status(500).json({ message: "發生錯誤" });
  }
}

module.exports = { handleLoadVolumeRequest };

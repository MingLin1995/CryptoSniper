// controllers/volumeDataController.js

// 引入相應的數據模型
const loadVolumeData = require("../models/loadVolumeData");

// 非同步函數：處理載入交易量數據的請求
async function handleLoadVolumeRequest(req, res) {
  // 從請求體中提取結果數據
  const results = req.body;
  try {
    // 使用模型函數獲取相應的交易量數據
    const allVolumeData = await loadVolumeData.getVolumeData(results);
    // 將取得的交易量數據返回給前端
    res.status(200).json(allVolumeData);
  } catch (error) {
    // 若有錯誤發生，返回500狀態碼和錯誤訊息
    res.status(500).json({ message: "發生錯誤" });
  }
}

// 將此控制器的函數導出，供路由使用
module.exports = {
  handleLoadVolumeRequest,
};

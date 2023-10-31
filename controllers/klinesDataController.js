// controllers/.js

// 引入相應的數據模型
const loadKlinesData = require("../models/loadKlinesData");

// 非同步函數：處理載入 Klines 數據的請求
async function handleLoadKlinesDataRequest(req, res) {
  // 從請求體中提取篩選條件
  const intervalData = req.body;
  try {
    // 使用模型函數獲取相應的 Klines 數據
    const allKlinesData = await loadKlinesData.getKlinesData(intervalData);
    // 將取得的 Klines 數據返回給前端
    res.status(200).json(allKlinesData);
  } catch (error) {
    // 若有錯誤發生，返回500狀態碼和錯誤訊息
    res.status(500).json({ message: "發生錯誤" });
  }
}

// 將此控制器的函數導出，供路由使用
module.exports = {
  handleLoadKlinesDataRequest,
};

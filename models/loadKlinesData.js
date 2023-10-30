// models/loadKlinesData.js
// 引入相應的數據模型
const { loadKlinesDataFromRedis } = require("./redisModel");

// 非同步函數：根據指定的時間間隔獲取K線數據
async function getKlinesData(timeIntervals) {
  // 初始化一個空對象來存儲所有K線數據
  const allKlinesData = {};

  // 遍歷傳入的時間間隔數據
  for (const timeInterval of timeIntervals) {
    // 調用從Redis中載入K線數據的函數，並傳遞當前時間間隔
    const klinesData = await loadKlinesDataFromRedis(timeInterval);
    // 將獲取到的K線數據存儲到對象中，使用時間間隔作為鍵
    allKlinesData[timeInterval] = klinesData;
  }

  // 返回整合的K線數據
  return allKlinesData;
}

// 將此模型的函數導出，供控制器使用
module.exports = {
  getKlinesData,
};

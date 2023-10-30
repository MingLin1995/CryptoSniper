// 引入相應的數據模型
const { loadDataFromRedis } = require("./redisModel");

// 非同步函數：根據結果集過濾出匹配的交易量數據
async function getVolumeData(results) {
  // 從Redis中載入交易量數據
  const symbolQuoteVolumeData = await loadDataFromRedis();

  // 過濾出匹配的交易量數據，並將其格式化
  const matchingVolumes = symbolQuoteVolumeData
    .filter((data) => results.includes(data.symbol)) // 篩選出匹配的標的
    .map((data) => ({ symbol: data.symbol, quote_volume: data.quote_volume })); // 格式化數據

  // 返回匹配的交易量數據
  return matchingVolumes;
}

// 將此模型的函數導出，供控制器使用
module.exports = {
  getVolumeData,
};

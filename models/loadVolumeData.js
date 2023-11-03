// models/loadVolumeData.js

const loadDataFromRedis = require("./redisModel");

async function getVolumeData(results) {
  const symbolQuoteVolumeData = await loadDataFromRedis();

  // 過濾出匹配的交易量數據，並將其格式化
  const matchingVolumes = symbolQuoteVolumeData
    .filter((data) => results.includes(data.symbol)) // 篩選出匹配的標的
    .map((data) => ({ symbol: data.symbol, quote_volume: data.quote_volume })); // 格式化數據

  return matchingVolumes;
}

module.exports = { getVolumeData };

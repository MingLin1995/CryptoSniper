// models/loadVolumeData.js

const { loadDataFromRedis } = require("./redis");

async function getVolumeData(results) {
  const symbolQuoteVolumeData = await loadDataFromRedis();

  const matchingVolumes = symbolQuoteVolumeData
    .filter((data) => results.includes(data.symbol))
    .map((data) => ({ symbol: data.symbol, quote_volume: data.quote_volume }));
  return matchingVolumes;
}

module.exports = { getVolumeData };

// models/loadKlinesData.js

const { loadKlinesDataFromRedis } = require("./redisModel");

async function getKlinesData(timeIntervals) {
  const allKlinesData = {};
  for (const timeInterval of timeIntervals) {
    const klinesData = await loadKlinesDataFromRedis(timeInterval);
    allKlinesData[timeInterval] = klinesData;
  }
  return allKlinesData;
}

module.exports = { getKlinesData };

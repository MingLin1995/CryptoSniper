// models/redis.js

require("dotenv").config();
const Redis = require("ioredis");
const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = 6379;
const redis = new Redis(REDIS_PORT, REDIS_HOST);

const time_intervals = {
  "5m": 5,
  "15m": 15,
  "30m": 30,
  "1h": 60,
  "2h": 60 * 2,
  "4h": 60 * 4,
  "1d": 60 * 24,
  "1w": 60 * 24,
  "1M": 60 * 24,
};

// 儲存交易量
function saveDataToRedis(data) {
  const key = "symbol_quote_volume_data";
  const serializedData = JSON.stringify(data);
  return redis.set(key, serializedData, "EX", 60 * 30);
}

// 取得交易量
function loadDataFromRedis() {
  const key = "symbol_quote_volume_data";
  return redis.get(key).then((cachedData) => {
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    return null;
  });
}

// 儲存K線數據
function saveKlinesDataToRedis(data, timeInterval) {
  const key = `kline_data_${timeInterval}`;
  const expirationTime = time_intervals[timeInterval];
  const serializedData = JSON.stringify(data);
  return redis.set(key, serializedData, "EX", expirationTime * 60 + 60 * 30);
}

// 取得K線數據
function loadKlinesDataFromRedis(timeInterval) {
  const key = `kline_data_${timeInterval}`;
  return redis.get(key).then((cachedData) => {
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    return null;
  });
}

module.exports = {
  saveDataToRedis,
  loadDataFromRedis,
  saveKlinesDataToRedis,
  loadKlinesDataFromRedis,
};

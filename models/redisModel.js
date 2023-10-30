// models/redisModel.js
const Redis = require("ioredis");

const REDIS_HOST = "localhost"; // Redis 伺服器地址
const REDIS_PORT = 6379; // Redis 伺服器端口
const redis = new Redis(REDIS_PORT, REDIS_HOST); // 建立新的Redis連接

const time_intervals = {
  // "1m": 1,
  // "3m": 3,
  "5m": 5,
  "15m": 15,
  "30m": 30,
  "1h": 60,
  "2h": 60 * 2,
  "4h": 60 * 4,
  "6h": 60 * 6,
  "8h": 60 * 8,
  "12h": 60 * 12,
  "1d": 60 * 24,
  "3d": 60 * 24,
  "1w": 60 * 24,
  "1M": 60 * 24,
};

// 儲存交易量數據到Redis
function saveDataToRedis(data) {
  const key = "symbol_quote_volume_data";
  const serializedData = JSON.stringify(data);
  return redis.set(key, serializedData, "EX", 60 * 30); // 數據有效期為30分鐘
}

// 從Redis加載交易量數據
function loadDataFromRedis() {
  const key = "symbol_quote_volume_data";
  return redis.get(key).then((cachedData) => {
    if (cachedData) {
      return JSON.parse(cachedData); // 如果數據存在，解析並返回
    }
    return null;
  });
}

// 儲存K線數據到Redis，並根據時間間隔設置適當的過期時間
function saveKlinesDataToRedis(data, timeInterval) {
  const key = `kline_data_${timeInterval}`;
  const expirationTime = time_intervals[timeInterval];
  const serializedData = JSON.stringify(data);
  return redis.set(key, serializedData, "EX", expirationTime * 60 + 60 * 30);
}

// 從Redis加載K線數據
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

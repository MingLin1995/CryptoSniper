const axios = require("axios");
const { loadDataFromRedis, saveKlinesDataToRedis } = require("./redisModel");
const schedule = require("node-schedule");

// 時框（用質數，避免同時間呼叫）
const timeIntervals = {
  "1m": 1,
  "3m": 3,
  "5m": 5,
  "15m": 13,
  "30m": 29,
  "1h": 59,
  "2h": 113,
  "4h": 239,
  "6h": 359,
  "8h": 479,
  "12h": 719,
  "1d": 1091,
  "3d": 1103,
  "1w": 1123,
  "1M": 1117,
};

// 更新K線數據
async function updateSymbolKlinesData(timeInterval) {
  try {
    const symbolQuoteVolumeData = await loadDataFromRedis();
    if (symbolQuoteVolumeData && Array.isArray(symbolQuoteVolumeData)) {
      const symbolsKlinesData = await getSymbolKlinesData(
        symbolQuoteVolumeData,
        timeInterval
      );

      if (symbolsKlinesData && symbolsKlinesData.length > 0) {
        await saveKlinesDataToRedis(symbolsKlinesData, timeInterval);
        console.log(
          `更新 symbol_close_prices_data_${timeInterval} 到 Redis`,
          new Date().toLocaleString()
        );
      } else {
        console.log(`更新失敗，時框：${timeInterval}`);
      }
    } else {
      console.log("無法更新Ｋ線數據");
    }
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

// 取得K線數據
async function getSymbolKlinesData(symbolQuoteVolumeData, timeInterval) {
  console.log(
    `呼叫 API！時間間隔：${timeInterval}`,
    new Date().toLocaleString()
  );

  const results = [];

  for (const entry of symbolQuoteVolumeData) {
    const data = await fetchKlinesData(entry.symbol, timeInterval);
    if (data !== null) {
      results.push(data);
    }
  }

  return results;
}

// 連接幣安API
const BASE_URL = "https://fapi.binance.com/fapi/v1";

async function fetchKlinesData(symbol, timeInterval) {
  const limit = 240;
  const klinesUrl = `${BASE_URL}/klines`;
  const params = {
    symbol: symbol,
    interval: timeInterval,
    limit: limit,
  };

  try {
    const response = await axios.get(klinesUrl, { params: params });
    if (response.status === 200) {
      const klinesData = response.data;
      klinesData.reverse();
      const closePrices = klinesData.map((entry) => parseFloat(entry[4]));

      const dataToStore = {
        [symbol]: { closePrices: closePrices },
      };

      return dataToStore;
    } else {
      console.log(`連接幣安K線資料失敗 ${symbol}: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.error(`連接幣安K線資料發生錯誤: ${symbol}: ${error}`);
    return null;
  }
}

// 主函数
async function main() {
  for (const timeInterval in timeIntervals) {
    // 安排任務
    await job(timeInterval);
    const updateFrequency = timeIntervals[timeInterval];
    schedule.scheduleJob(`*/${updateFrequency} * * * *`, async () => {
      await job(timeInterval);
    });
  }
}

// 追蹤執行狀態
const taskStatus = {};

// 延遲執行函式
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 執行任務
async function job(timeInterval) {
  if (taskStatus[timeInterval] && taskStatus[timeInterval].running) {
    console.log(`任務執行中：${timeInterval}`);
    return;
  }

  taskStatus[timeInterval] = { running: true };

  try {
    await updateSymbolKlinesData(timeInterval);
  } catch (error) {
    console.error(`任務發生錯誤 ${error}`);
  } finally {
    await delay(10000); // 暫停10秒，單位是毫秒
    taskStatus[timeInterval].running = false;
  }
}

// 啟動主函数
main().catch((error) => {
  console.error(`Main Error: ${error}`);
});

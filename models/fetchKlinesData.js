// models/fetchKlinesData.js

const axios = require("axios");
const { loadDataFromRedis, saveKlinesDataToRedis } = require("./redisModel");
const schedule = require("node-schedule");

// 時框
const timeIntervals = {
  // "1m": 1,
  // "3m": 2,
  "5m": 5,
  "15m": 6,
  "30m": 7,
  "1h": 8,
  "2h": 9,
  "4h": 10,
  "6h": 11,
  "8h": 12,
  "12h": 13,
  "1d": 14,
  "3d": 15,
  "1w": 16,
  "1M": 17,
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

// 异步函数，用于等待一段时间
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
    // 增加每個標的之間的時間間隔，避免大量呼叫API
    await sleep(800); // 500毫秒，每個時間框架處理時間約3分半
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
    updateSymbolKlinesData(timeInterval);
  }

  for (const timeInterval in timeIntervals) {
    const minutes = timeIntervals[timeInterval];
    setInterval(() => {
      updateSymbolKlinesData(timeInterval);
    }, minutes * 60 * 1000); // 分轉秒，秒轉毫秒（設定更新頻率）
  }
}

// 啟動主函数
main().catch((error) => {
  console.error(`Main Error: ${error}`);
});

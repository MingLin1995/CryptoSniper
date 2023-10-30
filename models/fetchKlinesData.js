// models/fetchKlinesData.js
const axios = require("axios");
const { loadDataFromRedis, saveKlinesDataToRedis } = require("./redisModel");

// 時框
const timeIntervals = {
  // "1m": 1,
  // "3m": 2,
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

// 更新指定時間間隔的K線數據
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
    console.error(`錯誤: ${error}`);
  }
}

// // 等待指定時間的異步函數
// function sleep(ms) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

async function updateAllTimeIntervals() {
  for (const timeInterval in timeIntervals) {
    await updateSymbolKlinesData(timeInterval);
  }
}

// 從API取得K線數據
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
    //await sleep(800); // 500毫秒，每個時間框架處理時間約3分半
  }

  return results;
}

// Binance的基本URL
const BASE_URL = "https://fapi.binance.com/fapi/v1";

// 使用API取得指定符號和時間間隔的K線數據
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

// // 主函數，對所有的時間間隔更新K線數據
// async function main() {
//   for (const timeInterval in timeIntervals) {
//     updateSymbolKlinesData(timeInterval);
//   }

//   for (const timeInterval in timeIntervals) {
//     const minutes = timeIntervals[timeInterval];
//     setInterval(() => {
//       updateSymbolKlinesData(timeInterval);
//     }, minutes * 60 * 1000); // 分轉秒，秒轉毫秒（設定更新頻率）
//   }
// }

// // 啟動主函数
// main().catch((error) => {
//   console.error(`Main Error: ${error}`);
// });

module.exports = {
  updateAllTimeIntervals,
  updateSymbolKlinesData,
};

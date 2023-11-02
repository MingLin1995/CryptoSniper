// models/fetchKlinesData.js

const axios = require("axios");
const { loadDataFromRedis, saveKlinesDataToRedis } = require("./redisModel");

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
        console.log(`－－－－－
更新 symbol_close_prices_data_${timeInterval}     ${new Date().toLocaleString()}`);
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

// 等待指定時間的異步函數
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 從API取得K線數據
async function getSymbolKlinesData(symbolQuoteVolumeData, timeInterval) {
  console.log(`－－－－－
呼叫 API！時間間隔：${timeInterval}     ${new Date().toLocaleString()}`);

  const results = [];

  for (const entry of symbolQuoteVolumeData) {
    const data = await fetchKlinesData(entry.symbol, timeInterval);
    if (data !== null) {
      results.push(data);
    }
    // 增加每個標的之間的時間間隔，避免大量呼叫API
    await sleep(1000);
    // 800毫秒，每個時間框架處理時間約4分 AWS 2.5分鐘(0.625倍)
    // 1000毫秒，每個時間框架處理時間約5分 AWS 4分鐘(0.625倍)
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

module.exports = {
  updateSymbolKlinesData,
};

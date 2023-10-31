// models/fetch24hData.js
const axios = require("axios");
const { saveDataToRedis } = require("./redisModel");

async function updateSymbolQuoteVolumeData() {
  try {
    const symbolQuoteVolumeData = await fetch24hrData();
    if (symbolQuoteVolumeData) {
      await saveDataToRedis(symbolQuoteVolumeData);
      console.log(
        "更新 symbol_quote_volume_data 到 Redis",
        new Date().toLocaleString()
      );
    } else {
      console.log("更新失敗");
    }
  } catch (error) {
    console.error(`錯誤: ${error}`);
  }
}

// Binance的基本URL
const BASE_URL = "https://fapi.binance.com/fapi/v1";

async function fetch24hrData() {
  try {
    const response = await axios.get(`${BASE_URL}/ticker/24hr`);
    if (response.status === 200) {
      console.log("成功調用API！");
      const data24hr = response.data;
      const symbolQuoteVolumeData = data24hr
        .map((entry) => ({
          symbol: entry.symbol,
          quote_volume: entry.quoteVolume,
        }))
        .sort((a, b) => b.quote_volume - a.quote_volume);
      return symbolQuoteVolumeData;
    } else {
      return null;
    }
  } catch (error) {
    console.error(`錯誤: ${error}`);
    return null;
  }
}

module.exports = {
  updateSymbolQuoteVolumeData,
};

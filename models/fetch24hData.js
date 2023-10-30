// models/fetch24hData.js
const axios = require("axios");
//const schedule = require("node-schedule");
const { saveDataToRedis } = require("./redisModel");

const BASE_URL = "https://fapi.binance.com/fapi/v1"; // 將基礎URL移到文件頂部

function updateSymbolQuoteVolumeData() {
  fetch24hrData()
    .then((symbolQuoteVolumeData) => {
      if (symbolQuoteVolumeData) {
        saveDataToRedis(symbolQuoteVolumeData);
        console.log(
          "更新 symbol_quote_volume_data 到 Redis",
          new Date().toLocaleString()
        );
      } else {
        console.log("更新失敗");
      }
    })
    .catch((error) => {
      console.error(`錯誤: ${error}`);
    });
}

function fetch24hrData() {
  return axios
    .get(`${BASE_URL}/ticker/24hr`)
    .then((response) => {
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
    })
    .catch((error) => {
      console.error(`錯誤: ${error}`);
      return null;
    });
}

// // 初始更新一次
// updateSymbolQuoteVolumeData();

// // 五分鐘更新一次
// schedule.scheduleJob("*/5 * * * *", () => {
//   updateSymbolQuoteVolumeData();
// });

module.exports = {
  updateSymbolQuoteVolumeData,
};

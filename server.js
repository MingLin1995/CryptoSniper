// server.js
const { updateSymbolQuoteVolumeData } = require("./models/fetch24hData");
const { updateSymbolKlinesData } = require("./models/fetchKlinesData");

// 時框
const timeIntervals = {
  "5m": 5 * 60 * 1000, // 轉換為毫秒
  "15m": 15 * 60 * 1000,
  "30m": 30 * 60 * 1000,
  "1h": 60 * 60 * 1000,
  "2h": 2 * 60 * 60 * 1000,
  "4h": 4 * 60 * 60 * 1000,
  "6h": 6 * 60 * 60 * 1000,
  "8h": 8 * 60 * 60 * 1000,
  "12h": 12 * 60 * 60 * 1000,
  "1d": 21 * 60 * 60 * 1000,
  "3d": 22 * 60 * 60 * 1000,
  "1w": 23 * 60 * 60 * 1000,
  "1M": 24 * 60 * 60 * 1000,
};

async function initialUpdate() {
  try {
    setInterval(async () => {
      await updateSymbolQuoteVolumeData();
    }, 5 * 60 * 1000); // 轉換為毫秒
    // 24hr Data
    await updateSymbolQuoteVolumeData();

    // Klines Data
    for (const [timeInterval, intervalMs] of Object.entries(timeIntervals)) {
      setInterval(async () => {
        await updateSymbolKlinesData(timeInterval);
      }, intervalMs);
      await updateSymbolKlinesData(timeInterval);
    }
  } catch (error) {
    console.error(`Initial update failed: ${error}`);
  }
}

function scheduleUpdates() {
  // 24hr Data
  // setInterval(async () => {
  //   await updateSymbolQuoteVolumeData();
  // }, 5 * 60 * 1000); // 轉換為毫秒
  // Klines Data
  // for (const [timeInterval, intervalMs] of Object.entries(timeIntervals)) {
  //   setInterval(async () => {
  //     await updateSymbolKlinesData(timeInterval);
  //   }, intervalMs);
  // }
}

async function run() {
  await initialUpdate();
  //scheduleUpdates();
}

run();

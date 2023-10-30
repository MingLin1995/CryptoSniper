// server.js
const { updateSymbolQuoteVolumeData } = require("./models/fetch24hData");
const { updateSymbolKlinesData } = require("./models/fetchKlinesData");
const schedule = require("node-schedule");

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
  "3d": 60 * 24 * 3,
  "1w": 60 * 24 * 7,
  "1M": 60 * 24 * 30,
};

// 隨機延遲函數
function randomDelay() {
  return new Promise((resolve) =>
    setTimeout(resolve, 10000 + Math.random() * 10000)
  );
}

// 進行初始更新
async function initialUpdate() {
  try {
    await updateSymbolQuoteVolumeData();
    for (const timeInterval of Object.keys(timeIntervals)) {
      await randomDelay();
      await updateSymbolKlinesData(timeInterval);
    }
  } catch (error) {
    console.error(`Initial update failed: ${error}`);
  }
}

initialUpdate();

// 每5分鐘更新24h資料
schedule.scheduleJob("*/5 * * * *", async () => {
  await randomDelay();
  updateSymbolQuoteVolumeData();
});

// 根據各個時間間隔設定更新K線
for (const timeInterval in timeIntervals) {
  const minutes = timeIntervals[timeInterval];
  schedule.scheduleJob(`*/${minutes} * * * *`, async () => {
    await randomDelay();
    updateSymbolKlinesData(timeInterval);
  });
}

console.log("Server started and schedules set.");

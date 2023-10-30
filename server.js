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
    setTimeout(resolve, 20000 + Math.random() * 10000)
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
  // initialUpdate 完成後，等待一段時間再啟動定期更新的作業
  setTimeout(scheduleUpdates, 20000); // 延遲20秒
}

function scheduleUpdates() {
  // 每5分鐘更新24h資料
  schedule.scheduleJob("*/5 * * * *", async () => {
    await randomDelay();
    updateSymbolQuoteVolumeData();
  });

  for (const timeInterval in timeIntervals) {
    const minutes = timeIntervals[timeInterval];

    // 使用setTimeout設定初始的延遲
    setTimeout(() => {
      // 啟動後的第一次觸發
      updateSymbolKlinesData(timeInterval);
      // 設定定時任務
      schedule.scheduleJob(`*/${minutes} * * * *`, async () => {
        await randomDelay();
        updateSymbolKlinesData(timeInterval);
      });
    }, 1 * 60 * 1000); // 乘以60將分鐘轉換為秒，再乘以1000將秒轉換為毫秒
  }
}

initialUpdate();

console.log("Server started and schedules set.");

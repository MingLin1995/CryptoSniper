// public/js/dataService.js

// 從伺服器取得K線資料
async function getKlinesData(intervalsData) {
  // param_1不為null的資料，取出時間區間
  const timeIntervals = intervalsData
    .filter((interval) => interval.param_1 !== null)
    .map((interval) => interval.time_interval);

  return fetch("/api/loadKlinesData", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(timeIntervals),
  }).then((response) => response.json());
}

// 從伺服器取得成交量資料
async function getResultsVolume(results) {
  return fetch("/api/loadVolumeData", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(results),
  }).then((response) => {
    if (!response.ok) {
      return response.json().then((err) => {
        throw new Error(err.message);
      });
    }
    return response.json(); //會出現錯誤，是因為五分鐘更新一次，所以抓日線資料，會沒有成交量
  });
}

export { getKlinesData, getResultsVolume };

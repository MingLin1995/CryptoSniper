// public/js/services/dataService.js

// 從伺服器取得K線資料
async function getKlinesData(intervalsData) {
  const timeIntervals = intervalsData
    .filter((interval) => interval.param_1 !== null)
    .map((interval) => interval.time_interval);

  const queryParams = new URLSearchParams({
    intervals: JSON.stringify(timeIntervals),
  });

  return fetch(`/api/loadKlinesData?${queryParams}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  }).then((response) => response.json());
}

// 從伺服器取得成交量資料
async function getResultsVolume(results) {
  const queryParams = new URLSearchParams({ results: JSON.stringify(results) });

  return fetch(`/api/loadVolumeData?${queryParams}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  }).then((response) => {
    if (!response.ok) {
      return response.json().then((err) => {
        throw new Error(err.message);
      });
    }
    return response.json();
  });
}

export { getKlinesData, getResultsVolume };

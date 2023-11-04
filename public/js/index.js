// public/js/index.js

import {
  extractFilterConditions,
  getKlinesData,
  calculateMA,
  compareMAValues,
  findIntersection,
  getResultsVolume,
  displayResults,
} from "./model.js";

// 取得篩選器表單
const filterForm = document.querySelector('form[name="filterForm"]');
filterForm.addEventListener("submit", function (event) {
  event.preventDefault(); // 阻止表單的默認提交行為
  processForm(); // 調用您的篩選函數
});

async function processForm() {
  const messageElement = document.getElementById("volume-header");
  const loadingMessageElement = document.getElementById("loading-message");
  const loadingImageContainer = document.querySelector(
    ".loading-image-container"
  );
  const resultsTable = document.getElementById("results-table");

  // 當開始處理時，顯示「搜尋中」訊息和動態GIF
  loadingMessageElement.style.display = "block";
  messageElement.innerHTML = "";

  const intervalsData = extractFilterConditions(); // 取得所有篩選條件

  try {
    const allKlinesData = await getKlinesData(intervalsData); // 取得K線資料

    // 計算移動平均值
    const maResults = calculateMA(allKlinesData, intervalsData);

    // 對比移動平均值
    const matchingData = compareMAValues(maResults, intervalsData);

    // 找出符合的數據
    const results = findIntersection(matchingData, intervalsData);

    // 取得所有符合結果的交易量
    const allResultsVolume = await getResultsVolume(results);

    // 在前端顯示結果
    displayResults(allResultsVolume);
    // 隱藏「搜尋中」訊息和動態GIF
    loadingMessageElement.style.display = "none";
    // 成功的情況下清除錯誤訊息
    messageElement.innerHTML = "";
  } catch (error) {
    resultsTable.style.display = "none";
    // 錯誤處理
    loadingImageContainer.innerHTML =
      "選擇的時間週期資料庫更新中，請稍後再試或是換個時框";
    console.error("錯誤:", error);
  }
}

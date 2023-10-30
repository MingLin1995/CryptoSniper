// public/index.js

import {
  extractFilterConditions,
  getKlinesData,
  calculateMA,
  compareMAValues,
  findIntersection,
  getResultsVolume,
  displayResults,
} from "./model.js";

// 取得過濾表單的按鈕
const submitButton = document.querySelector(".filterForm");

// 為按鈕添加「點擊」事件監聽器，當按下按鈕時執行 processForm 函數
submitButton.addEventListener("click", processForm);

// 主要處理表單的函數，用於獲取篩選條件，呼叫API取得數據，進行數據處理，並在前端顯示結果

async function processForm() {
  const messageElement = document.getElementById("message");

  // 當開始處理時，顯示「搜尋中...」訊息
  messageElement.innerHTML = "搜尋中...";

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
  } catch (error) {
    messageElement.innerHTML =
      "選擇的時間週期資料庫更新中，請稍後再試或是換個時框";
    console.error("錯誤:", error);
  }
}

// public/js/index.js

import { extractFilterConditions } from "./helpers.js";
import { getKlinesData, getResultsVolume } from "./services/dataService.js";
import { calculateMA, compareMAValues, findIntersection } from "./model.js";
import { displayResults } from "./viewHandlers.js";
import { createTradingViewWidget } from "./tradingViewConfig.js";
import { updateFavoritesModal } from "./viewHandlers.js";

// 取得篩選器表單
const filterForm = document.querySelector('form[name="filterForm"]');
filterForm.addEventListener("submit", function (event) {
  event.preventDefault(); // 阻止表單提交
  processForm();
});

async function processForm() {
  const resultContainer = document.getElementById("resultContainer");
  const loadingMessageElement = document.getElementById("loading-message");
  const loadingImageContainer = document.querySelector(
    ".loading-image-container"
  );
  const resultsTable = document.getElementById("results-table");
  const tradingViewContainer = document.getElementById("tradingViewContainer");

  resultContainer.style.display = "block";

  // 當開始處理時，顯示「搜尋中」訊息和動態GIF
  loadingMessageElement.style.display = "block";
  resultsTable.style.display = "none";
  tradingViewContainer.style.display = "none";

  const intervalsData = extractFilterConditions(); // 取得所有篩選條件

  try {
    // 取得K線資料
    const allKlinesData = await getKlinesData(intervalsData);

    // 檢查是否有為null的時間週期數據
    for (const key in allKlinesData) {
      if (allKlinesData[key] === null) {
        throw new Error(`數據為null: ${key}`);
      }
    }

    // 計算移動平均值
    const maResults = calculateMA(allKlinesData, intervalsData);

    // 依據ma做篩選
    const matchingData = compareMAValues(maResults, intervalsData);
    //1M出現錯誤，有可能是因為K線數量不足

    // 檢查 maResults 是否為空值
    if (Object.keys(matchingData).length === 0) {
      resultsTable.style.display = "none";
      tradingViewContainer.style.display = "none";
      loadingImageContainer.innerHTML = "查無任何標的";
      return;
    }

    // 找出符合的數據
    const results = findIntersection(matchingData, intervalsData);

    // 取得所有符合結果的交易量
    const allResultsVolume = await getResultsVolume(results);

    // 在前端顯示結果
    displayResults(allResultsVolume, intervalsData);

    // 隱藏「搜尋中」訊息和動態GIF
    loadingMessageElement.style.display = "none";

    // 確保結果表格是可見的
    resultsTable.style.display = "table";

    const symbol = `BINANCE:${results[0]}.P`;

    setTimeout(() => {
      createTradingViewWidget(intervalsData, symbol);
    }, 0);
  } catch (error) {
    resultsTable.style.display = "none";
    tradingViewContainer.style.display = "none";
    loadingImageContainer.innerHTML =
      "選擇的時間週期資料庫更新中，請稍後再試或是換個時框";
    //console.error("錯誤:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const favoritesButton = document.getElementById("favorites");
  favoritesButton.addEventListener("click", updateFavoritesModal);
});

document.addEventListener("DOMContentLoaded", function () {
  var tutorialModal = new bootstrap.Modal(
    document.getElementById("tutorialModal"),
    {}
  );
  tutorialModal.show();
});

document.querySelectorAll(".carousel-item img").forEach((img) => {
  img.addEventListener("click", function () {
    var src = this.getAttribute("src");
    // 這裡可以添加代碼來以全螢幕模式顯示圖片
  });
});

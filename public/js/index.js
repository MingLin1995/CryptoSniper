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
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const favoritesButton = document.getElementById("favorites");
  favoritesButton.addEventListener("click", (event) => {
    event.preventDefault();
    localStorage.setItem("openFavorites", "true");

    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "#ffffff";
    overlay.style.opacity = "0.7";
    overlay.style.zIndex = "9999";
    document.body.appendChild(overlay);

    const loadingIndicator = document.createElement("div");
    loadingIndicator.textContent = "正在載入追蹤清單...";
    loadingIndicator.style.position = "fixed";
    loadingIndicator.style.top = "50%";
    loadingIndicator.style.left = "50%";
    loadingIndicator.style.transform = "translate(-50%, -50%)";
    loadingIndicator.style.zIndex = "10000";
    loadingIndicator.style.color = "#000000";
    loadingIndicator.style.fontSize = "20px";
    document.body.appendChild(loadingIndicator);

    setTimeout(() => {
      window.location.reload();
    }, 100);
  });

  // 檢查是否需要打開追蹤清單
  if (localStorage.getItem("openFavorites") === "true") {
    // 移除標記
    localStorage.removeItem("openFavorites");

    setTimeout(async () => {
      $("#favoritesModal").modal("show");
      await updateFavoritesModal();
    }, 100);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // 檢查 localStorage 中是否有標記
  if (!localStorage.getItem("tutorialShown")) {
    var tutorialModal = new bootstrap.Modal(
      document.getElementById("tutorialModal"),
      {}
    );
    tutorialModal.show();

    // 設置標記表示教學已經顯示過
    localStorage.setItem("tutorialShown", "true");
  }
});

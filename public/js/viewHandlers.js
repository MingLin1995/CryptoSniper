// public/js/viewHandlers.js

import { createTradingViewWidget } from "./tradingViewConfig.js";
import { formatVolume, sortResultsByVolume } from "./helpers.js";

let indexObject = { currentIndex: 0 };

//建立表格
function createTableRow(item, intervalsData) {
  // 創建一個表格行並填充數據
  const tr = document.createElement("tr");

  // 創建標的名稱的列
  const tdSymbol = document.createElement("td");
  tdSymbol.textContent = item.symbol;
  tdSymbol.id = "symbol-column";
  tdSymbol.addEventListener("click", function () {
    handleSymbolClick(item.symbol, intervalsData);
  });

  // 創建交易量的列
  const tdVolume = document.createElement("td");
  tdVolume.textContent = formatVolume(item.quote_volume);

  // 將這兩列添加到行中
  tr.appendChild(tdSymbol);
  tr.appendChild(tdVolume);

  return tr; // 返回已創建的行
}

// 載入更多
function loadMoreResults(
  tbody,
  allResultsVolume,
  intervalsData,
  indexObject,
  loadCount
) {
  const endIndex = Math.min(
    indexObject.currentIndex + loadCount,
    allResultsVolume.length
  );

  for (; indexObject.currentIndex < endIndex; indexObject.currentIndex++) {
    const item = allResultsVolume[indexObject.currentIndex];
    const tr = createTableRow(item, intervalsData);
    tbody.appendChild(tr);
  }

  if (indexObject.currentIndex >= allResultsVolume.length) {
    const tr = document.createElement("tr");
    const tdEndMessage = document.createElement("td");
    tdEndMessage.colSpan = 2;
    tdEndMessage.textContent = "沒有更多資料了";
    tr.appendChild(tdEndMessage);
    tbody.appendChild(tr);
  }
}

// 滾動加載功能
function handleScroll(
  tbody,
  allResultsVolume,
  intervalsData,
  indexObject,
  loadCount
) {
  window.onscroll = function () {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 5 &&
      indexObject.currentIndex < allResultsVolume.length
    ) {
      loadMoreResults(
        tbody,
        allResultsVolume,
        intervalsData,
        indexObject,
        loadCount
      );
    }
  };
}

// 點擊標的
function handleSymbolClick(symbol, intervalsData) {
  const clickedSymbol = `BINANCE:${symbol}.P`;
  createTradingViewWidget(intervalsData, clickedSymbol);
  document.getElementById("targetSymbol").value = symbol;

  // 增加一個延遲，以確保頁面已經動態加載並渲染
  setTimeout(() => {
    const targetElement = document.getElementById("tradingViewContainer");

    targetElement.style.display = "block";

    // 獲取元素相對於視窗的位置
    const rect = targetElement.getBoundingClientRect();
    const offset = rect.top + window.scrollY;

    // 計算並滾動到元素應該在的位置
    const offsetPosition =
      offset - window.innerHeight / 2 + targetElement.clientHeight / 2;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }, 100);
}

// 前端畫面顯示
function displayResults(allResultsVolume, intervalsData) {
  const tbody = document.getElementById("results-tbody");
  tbody.innerHTML = ""; // 清空表格
  const loadCount = 10;

  // 重置currentIndex
  indexObject.currentIndex = 0;

  // 排序功能
  const volumeHeader = document.getElementById("volume-header");
  let isAscending = false;
  volumeHeader.onclick = () => {
    isAscending = !isAscending;
    allResultsVolume = sortResultsByVolume(allResultsVolume, isAscending);
    tbody.innerHTML = ""; // 清空表格
    indexObject.currentIndex = 0; // 重置currentIndex
    loadMoreResults(
      tbody,
      allResultsVolume,
      intervalsData,
      indexObject,
      loadCount
    ); // 重新加載並顯示排序後的結果
    handleScroll(
      tbody,
      allResultsVolume,
      intervalsData,
      indexObject,
      loadCount
    );
    // 如果有標的，則更新 TradingView Widget
    if (allResultsVolume.length > 0) {
      const firstSymbol = allResultsVolume[0].symbol;
      handleSymbolClick(firstSymbol, intervalsData);
    }
  };

  loadMoreResults(
    tbody,
    allResultsVolume,
    intervalsData,
    indexObject,
    loadCount
  );
  handleScroll(tbody, allResultsVolume, intervalsData, indexObject, loadCount);
}
// // 綁定模態視窗打開事件
// $("#notificationModal").on("show.bs.modal", function (e) {
//   checkUserSubscription();
// });

// 檢查用戶的訂閱狀態
async function checkUserSubscription() {
  const token = localStorage.getItem("token");
  try {
    // 這裡的'/api/check-subscription'是假設的端點，您需要替換為您實際的API路徑
    const response = await fetch("/api/subscription/check", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        // 添加其他需要的頭部，如認證令牌等
      },
    });

    if (!response.ok) {
      throw new Error("Server response 錯誤");
    }

    const { isSubscribed } = await response.json();

    // 更新按鈕文字
    updateSubscriptionButton(isSubscribed);
  } catch (error) {
    console.error("Failed to check subscription status:", error);
  }
}

// 更新訂閱按鈕的狀態
function updateSubscriptionButton(isSubscribed) {
  const button = document.getElementById("toggle-subscription");
  button.textContent = isSubscribed ? "取消訂閱" : "訂閱";
}

export { displayResults };

// public/js/viewHandlers.js

import { createTradingViewWidget } from "./tradingViewConfig.js";
import { formatVolume, sortResultsByVolume } from "./helpers.js";

let indexObject = { currentIndex: 0 };

//建立表格
function createTableRow(item, intervalsData) {
  // 創建表格的行
  const tr = document.createElement("tr");
  // 創建表格的的列
  const tdSymbol = document.createElement("td");
  //填入值
  tdSymbol.textContent = item.symbol;
  tdSymbol.id = "symbol-column";
  tdSymbol.addEventListener("click", function () {
    handleSymbolClick(item.symbol, intervalsData);
  });

  // 創建交易量的列
  const tdVolume = document.createElement("td");
  tdVolume.textContent = formatVolume(item.quote_volume);

  tr.appendChild(tdSymbol);
  tr.appendChild(tdVolume);

  return tr;
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
  document.getElementById("symbol-Notification").value = symbol;

  // 增加延遲，以確保頁面已經加載
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

// 檢查訂閱狀態
async function checkSubscriptionStatus(currentNotificationMethod) {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch("/api/subscription/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        notificationType: currentNotificationMethod,
      }),
    });

    if (!response.ok) {
      throw new Error("无法获取通知状态");
    }

    const data = await response.json();
    updateToggleButtonText(data.isEnabled, currentNotificationMethod);
  } catch (error) {
    console.error("检查通知状态失败：", error);
  }
}

// 更新切换通知按钮的文本
function updateToggleButtonText(isEnabled, currentNotificationMethod) {
  let button;
  if (currentNotificationMethod === "Line") {
    button = document.getElementById("toggle-line-notification");
  } else if (currentNotificationMethod === "Web") {
    button = document.getElementById("toggle-subscription");
  } else if (currentNotificationMethod === "Telegram") {
    button = document.getElementById("toggle-telegram-notification");
  }

  if (button) {
    button.textContent = isEnabled
      ? `關閉 ${currentNotificationMethod} 到價通知`
      : `開啟 ${currentNotificationMethod} 到價通知`;
    button.classList.toggle("btn-outline-danger", isEnabled);
    button.classList.toggle("btn-outline-primary", !isEnabled);
  }
}

//切換訂閱狀態
async function toggleNotification(currentNotificationMethod) {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("/api/subscription/toggle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        notificationType: currentNotificationMethod,
      }),
    });

    if (!response.ok) {
      throw new Error("無法切換通知狀態");
    }

    const data = await response.json();
    updateToggleButtonText(data.isEnabled, currentNotificationMethod);
  } catch (error) {
    console.error(
      `切換 ${currentNotificationMethod.toUpperCase()} 通知狀態失敗：`,
      error
    );
  }
}

export {
  displayResults,
  checkSubscriptionStatus,
  updateToggleButtonText,
  toggleNotification,
};

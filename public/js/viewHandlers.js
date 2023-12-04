// public/js/viewHandlers.js

import { createTradingViewWidget } from "./tradingViewConfig.js";
import { formatVolume, sortResultsByVolume } from "./helpers.js";
import { makeDraggable } from "./Bootstrap.js";
import { fetchUserStrategies } from "./strategySettings.js";
let indexObject = { currentIndex: 0 };
let userId = localStorage.getItem("userId");

//建立表格
function createTableRow(item, intervalsData, userFavorites) {
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

  // 創建追蹤清單的列
  const tdFavorite = document.createElement("td");
  // 增加追蹤按鈕
  const favoriteButton = document.createElement("button");
  favoriteButton.classList.add("btn", "btn-sm", "favorite-button");
  favoriteButton.setAttribute("data-symbol", item.symbol);
  favoriteButton.textContent = "＋";
  if (userFavorites.includes(item.symbol)) {
    favoriteButton.classList.add("btn-warning");
  } else {
    favoriteButton.classList.add("btn-outline-warning");
  }
  favoriteButton.onclick = () => toggleFavorite(item.symbol, favoriteButton);
  tdFavorite.appendChild(favoriteButton);

  tr.appendChild(tdFavorite);
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
  loadCount,
  userFavorites
) {
  const endIndex = Math.min(
    indexObject.currentIndex + loadCount,
    allResultsVolume.length
  );

  for (; indexObject.currentIndex < endIndex; indexObject.currentIndex++) {
    const item = allResultsVolume[indexObject.currentIndex];
    const tr = createTableRow(item, intervalsData, userFavorites);
    tbody.appendChild(tr);
  }

  if (indexObject.currentIndex >= allResultsVolume.length) {
    const tr = document.createElement("tr");
    const tdEndMessage = document.createElement("td");
    tdEndMessage.colSpan = 3;
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
  loadCount,
  userFavorites
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
        loadCount,
        userFavorites
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
  document.getElementById("symbol-line").value = symbol;

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

// 前端畫面顯示標的
function displayResults(allResultsVolume, intervalsData) {
  const tbody = document.getElementById("results-tbody");
  const loadCount = 10;
  let isAscending = false;

  // 取得追蹤清單
  loadFavorites()
    .then((userFavorites) => {
      // 清空表格，重置 currentIndex
      tbody.innerHTML = "";
      indexObject.currentIndex = 0;

      // 載入資料
      loadMoreResults(
        tbody,
        allResultsVolume,
        intervalsData,
        indexObject,
        loadCount,
        userFavorites
      );

      // 滾動載入資料
      handleScroll(
        tbody,
        allResultsVolume,
        intervalsData,
        indexObject,
        loadCount,
        userFavorites
      );

      // 排序
      const volumeHeader = document.getElementById("volume-header");
      volumeHeader.onclick = () => {
        isAscending = !isAscending;
        allResultsVolume = sortResultsByVolume(allResultsVolume, isAscending);
        tbody.innerHTML = "";
        indexObject.currentIndex = 0;
        loadMoreResults(
          tbody,
          allResultsVolume,
          intervalsData,
          indexObject,
          loadCount,
          userFavorites
        );
      };

      // 如果有標的，更新 TradingView Widget
      if (allResultsVolume.length > 0) {
        const firstSymbol = allResultsVolume[0].symbol;
        handleSymbolClick(firstSymbol, intervalsData);
      }
    })
    .catch((error) => {
      console.error("Error loading favorites:", error);
    });
}

// 檢查訂閱狀態
async function checkSubscriptionStatus(currentNotificationMethod) {
  const token = localStorage.getItem("token");
  const queryParams = new URLSearchParams({
    notificationType: currentNotificationMethod,
  }).toString();

  try {
    const response = await fetch(`/api/subscription?${queryParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    if (!response.ok) {
      throw new Error("無法獲取通知狀態");
    }

    const data = await response.json();
    updateToggleButtonText(data.isEnabled, currentNotificationMethod);
  } catch (error) {
    console.error("檢查通知狀態失敗：", error);
  }
}

// 更新切换通知按鈕
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
  const queryParams = new URLSearchParams({
    notificationType: currentNotificationMethod,
  }).toString();

  try {
    const response = await fetch(`/api/subscription?${queryParams}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
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

// 從後端獲取通知列表並顯示
function loadNotifications(currentNotificationMethod) {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/";
    return;
  }

  fetch(`/api/track?notificationMethod=${currentNotificationMethod}`, {
    // 使用 GET 方法和查詢參數
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  })
    .then((response) => {
      if (!response.ok) {
        response.json().then((errorResponse) => {
          console.log(errorResponse);
          if (errorResponse.error === "jwt expired") {
            window.location.href = "/";
            return;
          }
          throw new Error("無法獲取訂閱狀態");
        });
      } else {
        return response.json();
      }
    })
    .then((data) => {
      const notificationHeader = document.getElementById(
        `notificationHeader-${currentNotificationMethod}`
      );
      const notificationListId = `notificationList-${currentNotificationMethod}`;
      const notificationList = document.getElementById(notificationListId);

      notificationList.innerHTML = ""; // 清空當前列表
      // 檢查是否有通知列表
      if (data.length === 0) {
        notificationHeader.textContent = "尚未建立任何通知";
      } else {
        notificationHeader.textContent = "已建立的通知：";
        data.forEach((notification) => {
          const listItem = document.createElement("li");
          listItem.classList.add(
            "list-group-item",
            "d-flex",
            "justify-content-between",
            "align-items-center"
          );

          // 建立容器
          const textContainer = document.createElement("div");

          // 標的名稱
          const symbolText = document.createElement("div");
          symbolText.textContent = `標的名稱：${notification.symbol.toUpperCase()}`;
          textContainer.appendChild(symbolText);

          // 目標價
          const priceText = document.createElement("div");
          priceText.textContent = `目標價：${notification.targetPrice}`;
          textContainer.appendChild(priceText);

          listItem.appendChild(textContainer);

          // 刪除按鈕
          const deleteButton = document.createElement("button");
          deleteButton.setAttribute("type", "button");
          deleteButton.textContent = "刪除";
          deleteButton.classList.add("btn", "btn-outline-danger");
          deleteButton.onclick = () =>
            deleteNotification(notification._id, currentNotificationMethod);
          listItem.appendChild(deleteButton);

          notificationList.appendChild(listItem);
        });
      }
    })
    .catch((error) => console.error("Error:", error));
}

//刪除通知
function deleteNotification(notificationId, currentNotificationMethod) {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/";
    return;
  }

  fetch(`/api/track?id=${notificationId}`, {
    // 使用 DELETE 方法和查詢參數
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  })
    .then((response) => {
      if (!response.ok) {
        response.json().then((errorResponse) => {
          console.log(errorResponse);
          if (errorResponse.error === "jwt expired") {
            window.location.href = "/";
            return;
          }
          throw new Error("無法獲取訂閱狀態");
        });
      } else {
        return response.json();
      }
    })
    .then((data) => {
      if (data.message === "刪除成功") {
        loadNotifications(currentNotificationMethod); // 重新加載通知，更新列表
      } else {
        throw new Error("刪除失敗");
      }
    })

    .catch((error) => console.error("Error:", error));
}

//切換追蹤按鈕
function toggleFavorite(symbol, favoriteButton) {
  // 檢查是否有用戶ID，如果没有，返回首頁
  if (!userId) {
    alert("登入後即可使用此功能");
    return;
  }
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/";
    return;
  }

  // 檢查狀態
  const isFavorite = favoriteButton.classList.contains("btn-warning");

  const apiEndpoint = "/api/favorite";
  const method = isFavorite ? "DELETE" : "POST";

  const queryParams = new URLSearchParams({ userId, symbol }).toString();
  const url = isFavorite ? `${apiEndpoint}?${queryParams}` : apiEndpoint;

  fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: isFavorite ? null : JSON.stringify({ userId, symbol }),
  })
    .then((response) => {
      if (!response.ok) {
        response.json().then((errorResponse) => {
          console.log(errorResponse);
          if (errorResponse.error === "jwt expired") {
            window.location.href = "/";
            return;
          }
          throw new Error("無法獲取訂閱狀態");
        });
      } else {
        // 切换按鈕狀態
        favoriteButton.classList.toggle("btn-warning");
        favoriteButton.classList.toggle("btn-outline-warning");
        return response.json();
      }
    })
    .then((data) => {
      //console.log("追蹤清單已更新", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// 取得追蹤清單
function loadFavorites() {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    fetch("/api/favorite", {
      method: "GET",
      headers: {
        Authorization: token,
      },
    })
      .then((response) => response.json())
      .then((data) => resolve(data.favorites || []))
      .catch((error) => reject(error));
  });
}

// 更新追蹤列表
function updateFavoritesModal() {
  loadFavorites()
    .then((favorites) => {
      const favoritesList = document.getElementById("favoritesList");
      favoritesList.innerHTML = ""; // 清空列表

      if (favorites.length === 0) {
        // 如果追蹤為空
        const li = document.createElement("li");
        li.classList.add("list-group-item");
        li.textContent = "尚未建立任何追蹤";
        favoritesList.appendChild(li);
      } else {
        // 如果追蹤不為空
        favorites.forEach((symbol) => {
          if (!symbol) return;
          const li = document.createElement("li");
          li.classList.add(
            "list-group-item",
            "d-flex",
            "justify-content-between",
            "align-items-center"
          );
          li.setAttribute("data-id", symbol);
          makeDraggable(li);

          // 檢查是否為板塊
          const isSection = symbol.startsWith("section:");
          if (!isSection) {
            // 非板塊，增加點擊事件
            const symbolText = document.createElement("span");
            symbolText.classList.add("clickable-item");

            symbolText.textContent = symbol;
            symbolText.style.cursor = "pointer";
            symbolText.onclick = () => {
              // 點擊事件處理
              const intervalsData = [
                {
                  time_interval:
                    document.getElementById("time-interval-1").value,
                  param_1: parseInt(document.getElementById("MA1-1").value),
                  param_2: parseInt(document.getElementById("MA1-2").value),
                  comparison_operator_1: document.getElementById(
                    "comparison-operator-1-1"
                  ).value,
                  comparison_operator_2:
                    document.getElementById("comparison-operator-1-2")?.value ||
                    null,
                  logical_operator:
                    document.querySelector(
                      ".toggle-element-1:not(.hidden) #logical-operator-1"
                    )?.value || null,
                  param_3:
                    parseInt(document.getElementById("MA1-3")?.value) || null,
                  param_4:
                    parseInt(document.getElementById("MA1-4")?.value) || null,
                },
              ];
              handleSymbolClick(symbol, intervalsData);
              $("#favoritesModal").modal("hide");
            };
            li.appendChild(symbolText);
            li.style.marginBottom = "10px";
          } else {
            li.classList.add("section-item");

            let sectionName = symbol.split(":")[1]; // 取標的名稱
            li.textContent = sectionName;
            li.style.fontWeight = "bold";
            li.style.borderTop = "3px Solid";
            li.style.borderBottom = "3px Solid ";
            li.style.marginBottom = "10px";
          }

          const deleteButton = document.createElement("button");
          deleteButton.classList.add("btn", "btn-outline-danger", "btn-sm");
          deleteButton.textContent = "刪除";
          deleteButton.onclick = () => removeFavorite(symbol, userId);
          li.appendChild(deleteButton);

          favoritesList.appendChild(li);
        });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

//移除追蹤
function removeFavorite(symbol, userId) {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/";
    return;
  }

  const queryParams = new URLSearchParams({ userId, symbol }).toString();
  const url = `/api/favorite?${queryParams}`;

  fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  })
    .then((response) => {
      if (!response.ok) {
        response.json().then((errorResponse) => {
          console.log(errorResponse);
          if (errorResponse.error === "jwt expired") {
            window.location.href = "/";
            return;
          }
          throw new Error("無法獲取訂閱狀態");
        });
      } else {
        return response.json();
      }
    })
    .then((data) => {
      updateFavoritesModal(); // 重新載入列表

      // 更新追蹤按鈕狀態
      document.querySelectorAll(".favorite-button").forEach((button) => {
        if (button.getAttribute("data-symbol") === symbol) {
          button.classList.remove("btn-warning");
          button.classList.add("btn-outline-warning");
        }
      });
    })
    .catch((error) => console.error("Error:", error));
}

//顯示儲存的策略
function displayUserStrategies(strategies) {
  const strategiesList = document.getElementById("userStrategiesList");
  strategiesList.innerHTML = "";

  strategies.forEach((strategy) => {
    const isSection = strategy.name.startsWith("section:");
    const strategyDiv = document.createElement("div");
    strategyDiv.classList.add("strategy-item", "draggable-strategy");
    strategyDiv.setAttribute("data-id", strategy._id);
    makeDraggable(strategyDiv);

    const strategyHeader = document.createElement("div");
    strategyHeader.classList.add("strategy-header");

    const strategyName = document.createElement("div"); // 更改為 div
    strategyName.textContent = isSection
      ? strategy.name.replace("section:", "")
      : strategy.name;
    strategyName.classList.add("strategy-name");

    if (isSection) {
      strategyDiv.style.fontWeight = "bold";
      strategyDiv.style.borderTop = "3px solid";
      strategyDiv.style.borderBottom = "3px solid";
    } else {
      strategyName.classList.add("clickable-item");
      strategyName.onclick = function (event) {
        event.preventDefault();
        applyStrategy(strategy);
      };
    }

    strategyHeader.appendChild(strategyName);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "刪除";
    deleteButton.classList.add(
      "btn",
      "btn-outline-danger",
      "btn-sm",
      "delete-strategy"
    );
    deleteButton.type = "button";
    deleteButton.onclick = function (event) {
      event.preventDefault();
      deleteStrategy(strategy._id);
    };

    strategyHeader.appendChild(deleteButton);
    strategyDiv.appendChild(strategyHeader);

    if (!isSection) {
      const strategyDetails = document.createElement("div");
      strategyDetails.classList.add("strategy-details");
      strategyDetails.style.display = "none";

      strategy.conditions.forEach((condition, idx) => {
        if (condition.param_1 == null) return;

        const conditionDiv = document.createElement("div");
        conditionDiv.classList.add("condition");

        let conditionContent = `
        <strong>篩選條件 ${idx + 1} ：</strong>
        <ul>
          <li>時間週期： ${condition.time_interval}</li>
          <li>篩選條件： 
          ${condition.param_1} MA
          ${condition.comparison_operator_1}
          ${condition.param_2} MA`;

        if (condition.param_3 != null) {
          conditionContent += `
          ${condition.logical_operator}
          ${condition.param_3} MA
          ${condition.comparison_operator_2}
          ${condition.param_4} MA `;
        }

        conditionContent += `</li></ul>`;
        conditionDiv.innerHTML = conditionContent;
        strategyDetails.appendChild(conditionDiv);
      });

      strategyName.addEventListener("click", function () {
        strategyDetails.style.display =
          strategyDetails.style.display === "none" ? "block" : "none";
      });

      strategyDiv.appendChild(strategyDetails);
    }

    strategiesList.appendChild(strategyDiv);
  });
}

function displayNoStrategiesMessage() {
  const strategiesList = document.getElementById("userStrategiesList");
  strategiesList.innerHTML = "<p>尚未儲存任何策略</p>";
}

//將策略更新到篩選器
function applyStrategy(strategy) {
  // 首先清除之前的所有篩選條件
  clearFilters();

  strategy.conditions.forEach((condition, index) => {
    const groupIndex = index + 1;

    // 設置時間間隔
    document.getElementById(`time-interval-${groupIndex}`).value =
      condition.time_interval;

    // 設置參數值
    for (let j = 1; j <= 4; j++) {
      const element = document.getElementById(`MA${groupIndex}-${j}`);
      if (element) {
        element.value = condition[`param_${j}`] || "";
      }
    }

    // 設置比較運算符和邏輯運算符
    for (let j = 1; j <= 2; j++) {
      const operatorElement = document.getElementById(
        `comparison-operator-${groupIndex}-${j}`
      );
      if (operatorElement) {
        operatorElement.value = condition[`comparison_operator_${j}`] || "";
      }
    }

    const logicalOperatorElement = document.getElementById(
      `logical-operator-${groupIndex}`
    );
    if (logicalOperatorElement) {
      logicalOperatorElement.value = condition.logical_operator || "";
    }
  });
}

//清除篩選器內容
function clearFilters() {
  const parameterGroups = 4;
  for (let i = 1; i <= parameterGroups; i++) {
    document.getElementById(`time-interval-${i}`).value = "";

    for (let j = 1; j <= 4; j++) {
      const maElement = document.getElementById(`MA${i}-${j}`);
      if (maElement) maElement.value = "";
    }

    for (let j = 1; j <= 2; j++) {
      const operatorElement = document.getElementById(
        `comparison-operator-${i}-${j}`
      );
      if (operatorElement) operatorElement.value = "";
    }

    const logicalOperatorElement = document.getElementById(
      `logical-operator-${i}`
    );
    if (logicalOperatorElement) logicalOperatorElement.value = "";
  }
}

//刪除策略
function deleteStrategy(strategyId) {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/";
    return;
  }

  fetch(`/api/strategy?strategyId=${strategyId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        //console.log("策略删除成功:", strategyId);
        fetchUserStrategies();
      } else {
        console.error("策略刪除失败:", data.message);
      }
    })
    .catch((error) => {
      console.error("刪除策略時發生錯誤:", error);
    });
}

export {
  displayResults,
  checkSubscriptionStatus,
  updateToggleButtonText,
  toggleNotification,
  loadNotifications,
  updateFavoritesModal,
  removeFavorite,
  displayUserStrategies,
  displayNoStrategiesMessage,
  loadFavorites,
};

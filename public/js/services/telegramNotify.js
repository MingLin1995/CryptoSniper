// public/js/services/telegramNotify.js

import {
  checkSubscriptionStatus,
  toggleNotification,
  loadNotifications,
} from "../viewHandlers.js";

// 建立通知
document
  .getElementById("targetPriceForm-telegram")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    if (
      toggleTelegramSubscriptionButton.textContent == "開啟 Telegram 到價通知"
    ) {
      alert("尚未開啟 Telegram 到價通知！");
      return;
    }

    const telegramIdInput = document.getElementById("telegramId");
    const targetSymbolInput = document.getElementById("targetSymbol");
    const targetPriceInput = document.getElementById("targetPrice");

    // 獲取使用者輸入的值
    const telegramId = telegramIdInput.value;
    const symbol = targetSymbolInput.value;
    const targetPrice = targetPriceInput.value;

    // 選擇的通知方式
    const notificationMethod = currentNotificationMethod;

    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
      return;
    }
    fetch("/api/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        telegramId,
        notificationMethod,
        symbol,
        targetPrice,
      }),
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
        //console.log("Success:", data);
        //alert("到價通知設定成功！");

        // 更新用戶的 Telegram ID
        updateUserTelegramId(telegramId);

        localStorage.setItem("telegramId", telegramId);
        telegramIdInput.value = telegramId; // 更新輸入框中的值

        loadNotifications(currentNotificationMethod);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

// 更新Telegram ID
function updateUserTelegramId(telegramId) {
  // 發送請求更新用戶的 Telegram ID
  fetch("/api/updateTelegramId", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
    body: JSON.stringify({ telegramId }),
  })
    .then((response) => response.json())
    .then((data) => {
      //console.log(data);
      // 如果有新的Telegram ID，則更新資料庫和輸入框
      if (data.telegramId) {
        localStorage.setItem("telegramId", data.telegramId);
        document.getElementById("telegramId").value = data.telegramId;
      }
    })
    .catch((error) => {
      console.error("更新 Telegram ID 時發生錯誤:", error);
    });
}

// 頁面載入時顯示 Telegram ID
document.addEventListener("DOMContentLoaded", function () {
  const savedTelegramId = localStorage.getItem("telegramId");
  if (savedTelegramId) {
    document.getElementById("telegramId").value = savedTelegramId;
  }
});

let currentNotificationMethod;

// 綁定事件到所有帶有特定data-toggle的圖片
document.querySelectorAll('img[data-toggle="modal"]').forEach((img) => {
  img.addEventListener("click", function () {
    // 根據點擊的圖片設置通知方式
    currentNotificationMethod = this.getAttribute("data-notification-method");
  });
});

// 圖片
const notificationImageTelegram = document.getElementById(
  "NotificationPermissio-telegram"
);

// 點擊圖片時，請求通知許可
notificationImageTelegram.addEventListener("click", async function () {
  await checkSubscriptionStatus(currentNotificationMethod);
  loadNotifications(currentNotificationMethod);
});

//按鈕
const toggleTelegramSubscriptionButton = document.getElementById(
  "toggle-telegram-notification"
);

// 按鈕點擊時處理訂閱邏輯
toggleTelegramSubscriptionButton.addEventListener("click", async function () {
  toggleNotification(currentNotificationMethod);
});

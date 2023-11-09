// public/js/Tracking.js

function trackPrice(event) {
  event.preventDefault();

  const telegramIdInput = document.getElementById("telegramId");
  const targetSymbolInput = document.getElementById("targetSymbol");
  const targetPriceInput = document.getElementById("targetPrice");

  // 獲取使用者輸入的值
  const telegramId = telegramIdInput.value;
  const symbol = targetSymbolInput.value;
  const targetPrice = targetPriceInput.value;

  const notificationMethodSelect =
    document.getElementById("notificationMethod");
  const notificationMethod = notificationMethodSelect.value;

  const token = localStorage.getItem("token");
  fetch("/api/track", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({
      telegramId,
      notificationMethod, // 新增的通知方式選項
      symbol,
      targetPrice,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      //console.log("Success:", data);
      alert("成功設定追蹤");

      // 更新用戶的 Telegram ID
      updateUserTelegramId(telegramId);

      localStorage.setItem("telegramId", telegramId);
      telegramIdInput.value = telegramId; // 更新輸入框中的值
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("設定追蹤時發生錯誤");
    });
}

function updateUserTelegramId(telegramId) {
  // 發送請求更新用戶的 Telegram ID
  fetch("/api/user/updateTelegramId", {
    method: "POST",
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

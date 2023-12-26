// public/js/services/lineNotify.js
import {
  checkSubscriptionStatus,
  toggleNotification,
  loadNotifications,
} from "../viewHandlers.js";

function subscribeToPriceAlert() {
  const clientId = "tdsp4jfRPzQK90hInBMNWU";
  const redirectUri = encodeURIComponent(
    "https://crypto-sniper.minglin.vip/line-notify-callback"
  );
  const userId = localStorage.getItem("userId");
  const state = encodeURIComponent(generateRandomState(16) + "|" + userId);
  const authUrl = `https://notify-bot.line.me/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=notify&state=${state}`;

  window.location.href = authUrl;
}

//隨機字串
function generateRandomState(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

//建立 Line Notify
document
  .getElementById("line-subscription")
  .addEventListener("click", subscribeToPriceAlert);

//建立通知
document
  .getElementById("targetPriceForm-line")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    if (toggleLineSubscriptionButton.textContent == "開啟 Line 到價通知") {
      alert("尚未開啟 Line 到價通知！");
      return;
    }

    const symbol = document.getElementById("symbol-line").value;
    const targetPrice = document.getElementById("targetPrice-line").value;
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/";
      return;
    }

    const notificationMethod = currentNotificationMethod;

    fetch("/api/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        symbol: symbol,
        targetPrice: targetPrice,
        notificationMethod: notificationMethod,
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
            if (errorResponse.details === "找不到用戶的 Line Access Token") {
              alert("尚未連動 Line Notify！");
              return;
            }

            throw new Error("無法獲取訂閱狀態");
          });
        } else {
          return response.json();
        }
      })
      .then((data) => {
        loadNotifications(currentNotificationMethod);
      })
      .catch((error) => {
        alert("請先建立 Line Notify 連動！");
        console.error("Error:", error);
      });
  });

let currentNotificationMethod;

// 綁定事件到所有帶有特定data-toggle的圖片
document.querySelectorAll('img[data-toggle="modal"]').forEach((img) => {
  img.addEventListener("click", function () {
    // 根據點擊的圖片設置通知方式
    currentNotificationMethod = this.getAttribute("data-notification-method");
  });
});

// 圖片元素
const notificationImageLine = document.getElementById(
  "NotificationPermissio-line"
);

// 檢查訂閱狀態
notificationImageLine.addEventListener("click", function () {
  checkSubscriptionStatus(currentNotificationMethod);
  loadNotifications(currentNotificationMethod);
});

//按鈕元素
const toggleLineSubscriptionButton = document.getElementById(
  "toggle-line-notification"
);

// 切换訂閱狀態
toggleLineSubscriptionButton.addEventListener("click", function () {
  toggleNotification(currentNotificationMethod);
});

// CryptSniper/public/js/lineNotify.js
import {
  checkSubscriptionStatus,
  toggleNotification,
} from "../viewHandlers.js";

let currentNotificationMethod;

// 綁定事件到所有帶有特定data-toggle的圖片
document.querySelectorAll('img[data-toggle="modal"]').forEach((img) => {
  img.addEventListener("click", function () {
    // 根據點擊的圖片設置通知方式
    currentNotificationMethod = this.getAttribute("data-notification-method");
    // 根據選擇的通知方式顯示相應的視窗
    let targetModal = this.getAttribute("data-target");
    $(targetModal).modal("show");
  });
});

function subscribeToPriceAlert() {
  const clientId = "tdsp4jfRPzQK90hInBMNWU";
  const redirectUri = encodeURIComponent(
    "http://127.0.0.1:8000/line-notify-callback"
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

document
  .getElementById("line-subscription")
  .addEventListener("click", subscribeToPriceAlert);

document
  .getElementById("targetPriceForm-line")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    if (toggleLineSubscriptionButton.textContent == "開啟 Line 到價通知") {
      alert("尚未開啟到價通知！");
      return;
    }

    const symbol = document.getElementById("symbol-line").value; // 獲取使用者輸入的幣種
    const targetPrice = document.getElementById("targetPrice-line").value;
    const token = localStorage.getItem("token");

    // 使用先前選擇的通知方式
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
          const errorResponse = response.json();
          if (errorResponse.error === "jwt expired") {
            window.location.href = "/";
            return;
          }
          throw new Error("無法獲取訂閱狀態");
        }
      })
      .then((data) => {
        //console.log(data);
        alert("到價通知設定成功！");
      })
      .catch((error) => {
        alert("請先建立 Line Notify 連動！");
        console.error("Error:", error);
      });
  });

// 圖片元素
const notificationImageLine = document.getElementById(
  "NotificationPermissio-line"
);

// 檢查订阅状态
notificationImageLine.addEventListener("click", function () {
  checkSubscriptionStatus(currentNotificationMethod);
});

//按鈕元素
const toggleLineSubscriptionButton = document.getElementById(
  "toggle-line-notification"
);

// 切换订阅状态
toggleLineSubscriptionButton.addEventListener("click", function () {
  toggleNotification(currentNotificationMethod);
});

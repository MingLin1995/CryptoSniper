// public/js/services/notifications.js
import {
  checkSubscriptionStatus,
  updateToggleButtonText,
  toggleNotification,
  loadNotifications,
} from "../viewHandlers.js";

// 註冊 service worker
async function registerServiceWorker() {
  try {
    const registration = await navigator.serviceWorker.register(
      "/js/services/service-worker.js"
    );
    //console.log("Service Worker 註冊成功");
    return registration;
  } catch (error) {
    console.error("Service Worker 註冊失敗", error);
    return null;
  }
}

// 檢查瀏覽器支持
function checkBrowserSupport() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.warn("Push messaging is not supported");
    return false;
  }
  return true;
}

// 初始化函數
async function init() {
  if (!checkBrowserSupport()) {
    alert("此瀏覽器不支持推送通知。");
    return;
  }
  await registerServiceWorker();
}

init();

// 建立通知
document
  .getElementById("targetPriceForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      alert("未獲得您的通知許可權，請至瀏覽器設定開啟通知許可權");
      window.location.href = "/";

      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/";
      return;
    }

    const button = document.getElementById("toggle-subscription").textContent;
    if (button == "開啟 Web 到價通知") {
      alert("尚未開啟 Web 到價通知！");
      return;
    }

    const symbol = document.getElementById("symbol-Notification").value; // 獲取使用者輸入的幣種
    const targetPrice = document.getElementById(
      "targetPrice-Notification"
    ).value;

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
        //console.log(data);
        //alert("到價通知設定成功！");
        loadNotifications(currentNotificationMethod);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

// 通知許可權請求
async function requestNotificationPermission() {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    //console.log("用戶拒絕了通知許可權");
    return false;
  }
  //console.log("通知許可權獲得成功");
  return true;
}

// 判斷是否有訂閱
async function manageSubscription(registration) {
  if (!registration) {
    console.log("Service Worker 註冊不成功，無法管理訂閱");
    return;
  }

  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    // 沒有訂閱，創建新的訂閱
    subscription = await subscribeUser(registration);
  } else {
    //console.log("已經訂閱");
  }
}

// 建立新的訂閱
async function subscribeUser(registration) {
  try {
    const applicationServerKey = urlB64ToUint8Array(
      "BOJp-4zvWlggd-KBzFdjO1Uy5lcfiO-h_1exi9I0Ba6yWiAJVZb6Z0EDVcMC8pOKDec-9dS0iNLMuti7rwARARM"
    );
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey,
    });

    // 將訂閱詳情發送到後端
    await sendSubscriptionToBackend(subscription);

    console.log("用戶訂閱成功");
    updateToggleButtonText(true);
  } catch (error) {
    console.error("用戶訂閱失敗", error);
    updateToggleButtonText(false);
  }
}

// 輔助函數將Base64字符串轉換為Uint8Array
function urlB64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// 將訂閱詳情發送到後端
async function sendSubscriptionToBackend(subscription) {
  const token = localStorage.getItem("token");

  // 將訂閱對象轉換為適合發送的格式
  const subscriptionData = JSON.stringify(subscription);

  try {
    await fetch("/web-subscription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: subscriptionData,
    });
    //console.log("訂閱詳情已發送到後端");
  } catch (error) {
    console.error("發送訂閱詳情到後端失敗", error);
  }
}

// 點擊圖片時的許可通知
async function onClick() {
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) {
    alert("未獲得您的通知許可權，請至瀏覽器設定開啟通知許可權");
    window.location.href = "/";
    return;
  }
  const registration = await registerServiceWorker();
  if (registration) {
    await manageSubscription(registration);
  }
}

let currentNotificationMethod;

// 綁定事件到所有帶有特定data-toggle的圖片
document.querySelectorAll('img[data-toggle="modal"]').forEach((img) => {
  img.addEventListener("click", function () {
    // 根據點擊的圖片設置通知方式
    currentNotificationMethod = this.getAttribute("data-notification-method");
  });
});

// 圖片
const notificationImage = document.getElementById("NotificationPermissio-web");

// 點擊圖片時，請求通知許可
notificationImage.addEventListener("click", async function () {
  await onClick();
  await checkSubscriptionStatus(currentNotificationMethod);
  loadNotifications(currentNotificationMethod);
});

//按鈕
const toggleSubscriptionButton = document.getElementById("toggle-subscription");

// 按鈕點擊時處理訂閱邏輯
toggleSubscriptionButton.addEventListener("click", async function () {
  toggleNotification(currentNotificationMethod);
});

// public/js/notifications.js

// 獲取圖片元素
const imgElement = document.getElementById("notification-img");

// 檢查瀏覽器支持
function checkBrowserSupport() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.warn("Push messaging is not supported");
    imgElement.textContent = "Push Not Supported";
    return false;
  }
  return true;
}

// 註冊 service worker
async function registerServiceWorker() {
  try {
    const registration = await navigator.serviceWorker.register(
      "/js/service-worker.js"
    );
    console.log("Service Worker 註冊成功");
    return registration;
  } catch (error) {
    console.error("Service Worker 註冊失敗", error);
  }
}

// 通知許可權請求
async function requestNotificationPermission() {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    console.log("用戶拒絕了通知許可權");
    return false;
  }
  console.log("通知許可權獲得成功");
  return true;
}

// 主要訂閱邏輯
async function manageSubscription(registration) {
  const subscription = await registration.pushManager.getSubscription();
  if (subscription) {
    await unsubscribeUser(subscription);
  } else {
    await subscribeUser(registration);
  }
}

// 訂閱用戶
async function subscribeUser(registration) {
  try {
    const applicationServerKey = urlB64ToUint8Array(
      "BOJp-4zvWlggd-KBzFdjO1Uy5lcfiO-h_1exi9I0Ba6yWiAJVZb6Z0EDVcMC8pOKDec-9dS0iNLMuti7rwARARM"
    );
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey,
    });
    console.log("用戶已訂閱");
    await sendSubscriptionToBackend(subscription);
  } catch (err) {
    console.log("用戶訂閱失敗", err);
  }
}

// 取消訂閱用戶
async function unsubscribeUser(subscription) {
  try {
    const successful = await subscription.unsubscribe();
    if (successful) {
      console.log("用戶已取消訂閱");
      await sendUnsubscriptionToBackend(subscription);
    }
  } catch (e) {
    console.log("取消訂閱失敗", e);
  }
}

// 點擊圖片元素時的處理函數
async function onImageClick() {
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) return;

  const registration = await registerServiceWorker();
  if (registration) {
    await manageSubscription(registration);
  }
}

// 初始化函數
function init() {
  if (!checkBrowserSupport()) return;

  // 監聽點擊事件
  imgElement.addEventListener("click", onImageClick);
}

init();

// 輔助函數將Base64字符串轉換為Uint8Array
function urlB64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// 一個通用的函數來處理與後端的通信
async function communicateWithBackend(endpoint, subscription) {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(subscription),
    });

    if (!response.ok) {
      throw new Error("Bad response from server.");
    }

    const responseData = await response.json();
    if (responseData.error) {
      throw new Error(responseData.error);
    }

    console.log(`Response from ${endpoint}:`, responseData);
  } catch (error) {
    console.error(`Could not communicate with backend (${endpoint})`, error);
  }
}

// 使用新的通用函數
async function sendSubscriptionToBackend(subscription) {
  await communicateWithBackend("/api/subscription/subscribe", subscription);
}

async function sendUnsubscriptionToBackend(subscription) {
  await communicateWithBackend("/api/subscription/unsubscribe", subscription);
}

document
  .getElementById("targetPriceForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const symbol = document.getElementById("symbol-Notification").value; // 獲取使用者輸入的幣種
    const targetPrice = document.getElementById(
      "targetPrice-Notification"
    ).value;
    const token = localStorage.getItem("token");
    const notificationMethodSelect =
      document.getElementById("notificationMethod");
    const notificationMethod = notificationMethodSelect.value;

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
      }), // 添加symbol字段到body數據中
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // 處理成功設置目標價格的邏輯，例如通知用戶
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

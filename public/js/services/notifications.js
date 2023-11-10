// public/js/notifications.js

// 獲取圖片元素
const subscriptionElement = document.getElementById("toggle-subscription");

// 檢查瀏覽器支持
function checkBrowserSupport() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.warn("Push messaging is not supported");
    subscriptionElement.textContent = "Push Not Supported";
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
    // 顯示訂閱成功的訊息
    alert("您已成功訂閱通知！");
    // 更新按鈕的狀態
    updateSubscriptionButton(true);
  } catch (err) {
    console.log("用戶訂閱失敗", err);
    alert("訂閱失敗：", err);
    updateSubscriptionButton(false);
  }
}

// 取消訂閱用戶
async function unsubscribeUser(subscription) {
  try {
    const successful = await subscription.unsubscribe();
    if (successful) {
      console.log("用戶已取消訂閱");
      await sendUnsubscriptionToBackend(subscription);
      // 顯示取消訂閱成功的訊息
      alert("您已取消訂閱通知！");
      // 更新按鈕的狀態
      updateSubscriptionButton(false);
    }
  } catch (e) {
    console.log("取消訂閱失敗", e);
    alert("取消訂閱失敗：", e);
    updateSubscriptionButton(true);
  }
}

// 更新訂閱按鈕的狀態
function updateSubscriptionButton(isSubscribed) {
  const button = document.getElementById("toggle-subscription");
  if (isSubscribed) {
    button.textContent = "取消訂閱";
  } else {
    button.textContent = "訂閱";
  }
}

// 點擊元素時的處理函數
async function onClick() {
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
  subscriptionElement.addEventListener("click", onClick);
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

// 全局變量來存儲當前選擇的通知方法
let currentNotificationMethod = "Web"; // 預設值，根據需要修改

// 綁定事件到所有帶有特定data-toggle的圖片
document.querySelectorAll('img[data-toggle="modal"]').forEach((img) => {
  img.addEventListener("click", function () {
    // 根據點擊的圖片設置通知方式
    currentNotificationMethod = this.getAttribute("data-notification-method");

    // 根據通知方式顯示相應的模態視窗
    let targetModal = this.getAttribute("data-target");
    $(targetModal).modal("show");
  });
});

document
  .getElementById("targetPriceForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const symbol = document.getElementById("symbol-Notification").value; // 獲取使用者輸入的幣種
    const targetPrice = document.getElementById(
      "targetPrice-Notification"
    ).value;
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
      }), // 添加symbol字段到body數據中
    })
      .then((response) => response.json())
      .then((data) => {
        //console.log(data);
        // 處理成功設置目標價格的邏輯，例如通知用戶
        alert("成功設定追蹤");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

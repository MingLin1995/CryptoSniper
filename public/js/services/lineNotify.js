// CryptSniper/public/js/lineNotify.js

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

const toggleLineSubscriptionButton = document.getElementById(
  "toggle-line-notification"
);

document
  .getElementById("targetPriceForm-line")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    if (toggleLineSubscriptionButton.textContent == "開啟 LINE 通知") {
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
        console.error("Error:", error);
      });
  });

// 獲取圖片元素和按鈕元素
const notificationImageLine = document.getElementById(
  "NotificationPermissio-line"
);

// 點擊圖片時，請求通知許可
notificationImageLine.addEventListener("click", async function () {
  await updateToggleButtonText();
});

// 切换 LINE 通知狀態的函数
async function toggleLineNotification() {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch("/api/user/toggleNotification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    if (!response.ok) {
      throw new Error("無法切換通知狀態");
    }

    const data = await response.json();
    updateToggleButtonText(); // 更新按鈕資訊
  } catch (error) {
    console.error("切换 LINE 通知狀態失敗：", error);
  }
}

// 更新切换通知按钮
async function updateToggleButtonText() {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch("/api/user/checkNotification", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    if (!response.ok) {
      throw new Error("無法切換通知狀態");
    }

    const data = await response.json();

    // 清除先前的按钮class
    toggleLineSubscriptionButton.classList.remove(
      "btn-outline-primary",
      "btn-outline-danger"
    );

    if (data.lineNotificationsEnabled) {
      toggleLineSubscriptionButton.textContent = "關閉 LINE 通知";
      toggleLineSubscriptionButton.classList.add("btn-outline-danger"); // 红色按鈕
    } else {
      toggleLineSubscriptionButton.textContent = "開啟 LINE 通知";
      toggleLineSubscriptionButton.classList.add("btn-outline-primary"); // 藍色按鈕
    }
  } catch (error) {
    console.error("取得 LINE 通知狀態失敗：", error);
  }
}

toggleLineSubscriptionButton.addEventListener("click", function () {
  toggleLineNotification();
});

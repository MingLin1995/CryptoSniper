// public/js/User.js

function isUserLoggedIn() {
  // 檢查 localStorage 是否有 token
  return localStorage.getItem("token") !== null;
}

// 在頁面加載時檢查用戶的登錄狀態
window.onload = function () {
  if (isUserLoggedIn()) {
    // 如果用戶已登入，則獲取和顯示 Telegram ID
    getTelegramId();
  } else {
    // 如果用戶未登入，則不顯示 Telegram ID 相關信息
    document.getElementById("telegramId").value = "";
  }
};

async function getTelegramId() {
  // 從伺服器或localStorage獲取用戶的Telegram ID，並設置到輸入框中
  const savedTelegramId = localStorage.getItem("telegramId");
  if (savedTelegramId) {
    document.getElementById("telegramId").value = savedTelegramId;
  }
}

// 註冊
async function register() {
  const name = document.getElementById("registerName").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  try {
    const response = await fetch("/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("註冊成功！" + JSON.stringify(data));
    } else {
      alert("註冊失敗：" + data.message);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("註冊失敗！");
  }
}

// 登入
async function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const response = await fetch("/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("登入成功！" + data.message);
      localStorage.setItem("token", data.token); // 將 token 儲存到瀏覽器的 localStorage

      // 假設伺服器返回的數據中包含了 telegramId
      if (data.telegramId) {
        localStorage.setItem("telegramId", data.telegramId); // 將 telegramId 儲存到 localStorage
      }

      location.reload(); // 重新加載頁面
    } else {
      alert("登入失敗：" + data.error);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("伺服器錯誤");
  }
}

// 登出

async function logout() {
  try {
    const response = await fetch("/api/users/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });

    if (response.ok) {
      localStorage.removeItem("token");
      localStorage.removeItem("telegramId"); // 登出時也移除 telegramId
      alert("登出成功！");
      location.reload();
    } else {
      const data = await response.json();
      alert("登出失敗：" + data.error);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("伺服器錯誤");
  }
}

// public/js/User.js

document.addEventListener("DOMContentLoaded", () => {
  checkLoginStatus();
  applyThemePreference();
});

function applyThemePreference() {
  const theme = localStorage.getItem("theme");
  if (theme === "day-mode") {
    document.body.classList.remove("night-mode");
  } else {
    document.body.classList.add("night-mode");
  }
}

async function checkLoginStatus() {
  const token = localStorage.getItem("token");
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const hiddenBeforeLoginElements = document.querySelectorAll(
    ".hidden-before-login"
  );

  if (token) {
    // 驗證token是否有效
    try {
      const response = await fetch("/api/user/verifyToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (!response.ok) {
        // token無效，清除token並返回
        localStorage.removeItem("token");
        localStorage.removeItem("telegramId");
        localStorage.removeItem("userId");

        throw new Error("Token expired");
      }
    } catch (error) {
      // 處理token過期或其他錯誤
      console.error(error);
      return checkLoginStatus(); // 重新檢查登錄狀態
    }

    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    getTelegramId();

    // 顯示所有需要在登入後顯示的元素
    hiddenBeforeLoginElements.forEach((el) => {
      el.style.display = "block";
    });
  } else {
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    document.getElementById("telegramId").value = "";
    // 隱藏所有需要在登入前隱藏的元素
    hiddenBeforeLoginElements.forEach((el) => {
      el.style.display = "none";
    });
    localStorage.removeItem("token");
    localStorage.removeItem("telegramId");
    localStorage.removeItem("userId");
  }
}

async function getTelegramId() {
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
    const response = await fetch("/api/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("註冊成功！");
    } else {
      alert("註冊失敗：" + data.message);
    }
  } catch (error) {
    //console.error("Error:", error);
    alert("伺服器錯誤");
  }
}

async function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const response = await fetch("/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("登入成功！");
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);

      if (data.telegramId) {
        localStorage.setItem("telegramId", data.telegramId);
        document.getElementById("telegramId").value = data.telegramId;
      }

      $("#loginModal").modal("hide");
      checkLoginStatus();
    } else {
      alert("登入失敗：" + data.error);
    }
  } catch (error) {
    //console.error("Error:", error);
    alert("伺服器錯誤");
  }
}

async function logout() {
  try {
    const response = await fetch("/api/user/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });

    if (response.ok) {
      localStorage.removeItem("token");
      localStorage.removeItem("telegramId");
      localStorage.removeItem("userId");
      alert("登出成功！");
      checkLoginStatus();
    } else {
      const data = await response.json();
      window.location.href = "/";
    }
  } catch (error) {
    console.error("Error:", error);
    window.location.href = "/";
  }
}

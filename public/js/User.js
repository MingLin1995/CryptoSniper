// public/js/User.js

document.addEventListener("DOMContentLoaded", () => {
  checkLoginStatus();
});

function checkLoginStatus() {
  const token = localStorage.getItem("token");
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const trackingForm = document.getElementById("trackingForm");
  const hiddenBeforeLoginElements = document.querySelectorAll(
    ".hidden-before-login"
  );

  if (token) {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    trackingForm.style.display = "block";
    getTelegramId();

    // 顯示所有需要在登入後顯示的元素
    hiddenBeforeLoginElements.forEach((el) => {
      el.style.display = "block";
    });
  } else {
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    document.getElementById("telegramId").value = "";
    trackingForm.style.display = "none";
    // 隱藏所有需要在登入前隱藏的元素
    hiddenBeforeLoginElements.forEach((el) => {
      el.style.display = "none";
    });
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
      localStorage.setItem("token", data.token);

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
    console.error("Error:", error);
    alert("伺服器錯誤");
  }
}

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
      localStorage.removeItem("telegramId");
      alert("登出成功！");
      checkLoginStatus();
    } else {
      const data = await response.json();
      alert("登出失敗：" + data.error);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("伺服器錯誤");
  }
}

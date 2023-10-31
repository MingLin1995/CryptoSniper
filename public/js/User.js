// public/js/User.js

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
      localStorage.removeItem("token"); // 刪除瀏覽器的 localStorage 中的 token
      alert("登出成功！");
    } else {
      const data = await response.json();
      alert("登出失敗：" + data.error);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("伺服器錯誤");
  }
}

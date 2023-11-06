// public/js/Bootstrap.js

// 背景切換
document
  .getElementById("toggleThemeBtn")
  .addEventListener("click", function () {
    document.body.classList.toggle("night-mode");

    if (document.body.classList.contains("night-mode")) {
      localStorage.removeItem("theme");
    } else {
      localStorage.setItem("theme", "day-mode");
    }
  });

// 顯示篩選條件
document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("toggle-filters-btn-1");
  const toggleElements = document.querySelectorAll(".toggle-element-1");

  toggleButton.addEventListener("click", function () {
    // 切換每個 toggle-element 的顯示狀態
    toggleElements.forEach(function (element) {
      element.classList.toggle("hidden");
    });
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("toggle-filters-btn-2");
  const toggleElements = document.querySelectorAll(".toggle-element-2");

  toggleButton.addEventListener("click", function () {
    // 切換每個 toggle-element 的顯示狀態
    toggleElements.forEach(function (element) {
      element.classList.toggle("hidden");
    });
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("toggle-filters-btn-3");
  const toggleElements = document.querySelectorAll(".toggle-element-3");

  toggleButton.addEventListener("click", function () {
    // 切換每個 toggle-element 的顯示狀態
    toggleElements.forEach(function (element) {
      element.classList.toggle("hidden");
    });
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("toggle-filters-btn-4");
  const toggleElements = document.querySelectorAll(".toggle-element-4");

  toggleButton.addEventListener("click", function () {
    // 切換每個 toggle-element 的顯示狀態
    toggleElements.forEach(function (element) {
      element.classList.toggle("hidden");
    });
  });
});

//增加不同時間週期
document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("add-time-period-1");
  const toggleElement = document.querySelector(".toggle-element-5");

  toggleButton.addEventListener("click", function () {
    toggleElement.classList.toggle("hidden");
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("add-time-period-2");
  const toggleElement = document.querySelector(".toggle-element-6");

  toggleButton.addEventListener("click", function () {
    toggleElement.classList.toggle("hidden");
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("add-time-period-3");
  const toggleElement = document.querySelector(".toggle-element-7");

  toggleButton.addEventListener("click", function () {
    toggleElement.classList.toggle("hidden");
  });
});

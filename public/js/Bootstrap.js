// public/js/Bootstrap.js

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

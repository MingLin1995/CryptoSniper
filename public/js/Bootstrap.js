// public/js/Bootstrap.js

import {
  removeFavorite,
  loadFavorites,
  updateFavoritesModal,
} from "./viewHandlers.js";

import { fetchUserStrategies } from "./strategySettings.js";

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
    toggleElements.forEach(function (element) {
      element.classList.toggle("hidden");
    });
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("toggle-filters-btn-2");
  const toggleElements = document.querySelectorAll(".toggle-element-2");

  toggleButton.addEventListener("click", function () {
    toggleElements.forEach(function (element) {
      element.classList.toggle("hidden");
    });
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("toggle-filters-btn-3");
  const toggleElements = document.querySelectorAll(".toggle-element-3");

  toggleButton.addEventListener("click", function () {
    toggleElements.forEach(function (element) {
      element.classList.toggle("hidden");
    });
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("toggle-filters-btn-4");
  const toggleElements = document.querySelectorAll(".toggle-element-4");

  toggleButton.addEventListener("click", function () {
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

// 使列表可以拖動
function makeDraggable(li) {
  li.setAttribute("draggable", "true");
  li.addEventListener("dragstart", handleDragStart);
  li.addEventListener("dragover", handleDragOver);
  li.addEventListener("drop", handleDrop);
  li.addEventListener("dragend", handleDragEnd);
  li.addEventListener("dragenter", handleDragEnter);
  li.addEventListener("dragleave", handleDragLeave);
}

// 拖動開始
let draggedItem = null;
function handleDragStart(e) {
  draggedItem = this;
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/html", this.innerHTML);
}

// 拖動經過其他選項
function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
  this.classList.add("drag-over"); // 放置的效果
}

// 拖動進入可放置區域
function handleDragEnter(e) {
  this.classList.add("drag-over");
}

// 拖動離開可放置區域
function handleDragLeave(e) {
  this.classList.remove("drag-over");
}

// 放置時
function handleDrop(e) {
  e.stopPropagation();
  if (draggedItem !== this) {
    const parent = this.parentNode;
    const tempDraggedItem = draggedItem;

    if (this.nextSibling === tempDraggedItem) {
      parent.insertBefore(tempDraggedItem, this);
    } else {
      parent.insertBefore(tempDraggedItem, this.nextSibling);
    }

    const isSwapped = tempDraggedItem !== draggedItem;

    if (isSwapped) {
      if (tempDraggedItem.classList.contains("strategy-item")) {
        updateStrategyOrderOnServer(); // 更新策略順序
      } else if (tempDraggedItem.closest("#favoritesList")) {
        updateListOrderOnServer(); // 更新追蹤清單順序
      }
    }
  }
}

// 拖動結束
function handleDragEnd(e) {
  draggedItem = null;
  if (this.classList.contains("strategy-item")) {
    updateStrategyOrderOnServer(); // 更新策略順序
  } else if (this.closest("#favoritesList")) {
    updateListOrderOnServer(); // 更新追蹤清單順序
  }

  document.querySelectorAll(".drag-over").forEach((el) => {
    el.classList.remove("drag-over");
  });
}

// 更新追蹤清單順序
function updateListOrderOnServer() {
  var items = document.querySelectorAll("#favoritesList li");
  var itemOrder = Array.from(items).map(function (item) {
    return item.getAttribute("data-id");
  });
  const token = localStorage.getItem("token");

  fetch("/api/favorite", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ order: itemOrder }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (!data.success) {
        if (data.message === "jwt expired") {
          window.location.href = "/";
        } else {
          throw new Error(data.message || "更新追蹤清單失敗");
        }
      } else {
        //console.log(data.message);
      }
    })
    .catch((error) => console.error("Error:", error));
}

// 更新自訂策略順序
function updateStrategyOrderOnServer() {
  var items = document.querySelectorAll(".strategy-item");
  var itemOrder = Array.from(items).map(function (item) {
    return item.getAttribute("data-id");
  });
  const token = localStorage.getItem("token");

  fetch("/api/strategy", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ order: itemOrder }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (!data.success) {
        if (data.message === "jwt expired") {
          window.location.href = "/";
        } else {
          throw new Error(data.message || "更新策略順序失敗");
        }
      } else {
        //console.log(data.message);
      }
    })
    .catch((error) => console.error("Error updating order:", error));
}

export { makeDraggable, handleDragStart, handleDragOver, handleDrop };

document.querySelectorAll(".tab-link").forEach(function (el) {
  el.addEventListener("click", function () {
    // 移除所有按鈕上的 'btn-primary' 類別並添加 'btn-outline-primary'
    document.querySelectorAll(".tab-link").forEach(function (el) {
      el.classList.remove("btn-primary");
      el.classList.add("btn-outline-primary");
    });

    // 為當前點擊的按鈕添加 'btn-primary' 並移除 'btn-outline-primary'
    this.classList.remove("btn-outline-primary");
    this.classList.add("btn-primary");

    // 切換顯示的內容
    var targetId = this.getAttribute("data-target");
    document.querySelectorAll(".tab-content").forEach(function (tab) {
      tab.style.display = "none";
    });
    document.querySelector(targetId).style.display = "block";
  });
});

// 追蹤清單，新增板塊
document.getElementById("addSection").addEventListener("click", function () {
  let sectionName = prompt("請輸入板塊名稱");
  if (sectionName) {
    let section = createListItem(sectionName, true);
    document.getElementById("favoritesList").appendChild(section);
    makeDraggable(section);
  }
});

function createListItem(name, isSection) {
  let li = document.createElement("li");
  li.classList.add(
    "list-group-item",
    "d-flex",
    "justify-content-between",
    "align-items-center"
  );
  li.textContent = name;
  li.setAttribute("data-id", `section:${name}:${Date.now()}`);
  if (isSection) {
    li.classList.add("section-title");
    li.textContent = name;
    li.style.fontWeight = "bold";
    li.style.borderTop = "3px Solid";
    li.style.borderBottom = "3px Solid ";
  }
  makeDraggable(li);
  li.style.marginBottom = "10px";

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("btn", "btn-outline-danger", "btn-sm");
  deleteButton.textContent = "刪除";

  deleteButton.onclick = () =>
    removeFavorite(name, localStorage.getItem("userId"));
  li.appendChild(deleteButton);

  favoritesList.appendChild(li);
  updateListOrderOnServer();
  loadFavorites();
  updateFavoritesModal();
  return li;
}

// 策略清單，新增板塊
document
  .getElementById("createSectionButton")
  .addEventListener("click", function (event) {
    event.preventDefault();
    const sectionName = prompt("請輸入板塊名稱");
    if (sectionName) {
      createSection("section:" + sectionName);
    }
  });

// 建立板塊
function createSection(sectionName) {
  const token = localStorage.getItem("token");
  const sectionData = {
    name: sectionName,
    conditions: [],
  };

  fetch("/api/strategy", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(sectionData),
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
      if (data.success) {
        fetchUserStrategies().then(() => {
          document.querySelectorAll(".strategy-item").forEach(makeDraggable);
        });
      } else {
        alert("板塊创建失败。");
      }
    })
    .catch((error) => console.error("Error:", error));
}

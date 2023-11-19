import { makeDraggable } from "./Bootstrap.js";

document
  .getElementById("saveStrategyModalButton")
  .addEventListener("click", function (event) {
    event.preventDefault();
    saveStrategy();
  });

// 取得篩選條件
function getFilters() {
  const parameterGroups = 4;
  const intervalsData = [];

  for (let i = 1; i <= parameterGroups; i++) {
    const timeInterval = document.getElementById(`time-interval-${i}`).value;

    for (let j = 1; j <= parameterGroups; j++) {
      const maParamElement = document.getElementById(`MA${i}-${j}`);
      const maParamValue = maParamElement.value;

      if (maParamValue !== "") {
        const maValueNum = parseInt(maParamValue);

        if (
          !Number.isInteger(maValueNum) ||
          maValueNum <= 0 ||
          maValueNum > 240
        ) {
          alert("請輸入正整數，最多支援到240MA");
          maParamElement.focus();
          return null;
        }
      }
    }

    const maParameters = Array.from({ length: parameterGroups }, (_, j) => {
      const maParamValue = document.getElementById(`MA${i}-${j + 1}`).value;
      return { value: maParamValue ? parseInt(maParamValue) : null };
    });

    const comparisonOperator = Array.from({ length: 2 }, (_, j) => ({
      comparisonOperator: document.getElementById(
        `comparison-operator-${i}-${j + 1}`
      ).value,
    }));

    const logicalOperator = document.getElementById(
      `logical-operator-${i}`
    ).value;

    intervalsData.push({
      time_interval: timeInterval,
      param_1: maParameters[0].value,
      param_2: maParameters[1].value,
      param_3: maParameters[2].value,
      param_4: maParameters[3].value,
      comparison_operator_1: comparisonOperator[0].comparisonOperator,
      comparison_operator_2: comparisonOperator[1].comparisonOperator,
      logical_operator: logicalOperator,
    });
  }

  // 新增：讓用戶輸入策略名稱
  const strategyName = prompt("請為您的策略命名:");
  if (!strategyName) {
    alert("策略未命名，無法保存。");
    return null;
  }

  return {
    name: strategyName,
    conditions: intervalsData,
  };
}

//保存策略
function saveStrategy() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/";
    return;
  }

  const strategy = getFilters();
  if (!strategy) return;

  fetch("/api/strategy", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(strategy),
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
        //alert("策略已成功保存！");
        fetchUserStrategies();
      } else {
        alert("策略保存失敗。");
      }
    })
    .catch((error) => {
      console.error("保存策略時發生錯誤: ", error);
    });
}

document.getElementById("options").addEventListener("click", function () {
  fetchUserStrategies();
});

//取得儲存的策略
function fetchUserStrategies() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/";
    return;
  }
  fetch("/api/strategy", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        if (data.strategies && data.strategies.length > 0) {
          displayUserStrategies(data.strategies);
        } else {
          displayNoStrategiesMessage();
        }
      }
    });
}

//顯示儲存的策略
function displayUserStrategies(strategies) {
  const strategiesList = document.getElementById("userStrategiesList");
  strategiesList.innerHTML = "";

  strategies.forEach((strategy) => {
    const strategyDiv = document.createElement("div");
    strategyDiv.classList.add("strategy-item");
    strategyDiv.classList.add("draggable-strategy"); // 拖曳class
    makeDraggable(strategyDiv);

    const strategyHeader = document.createElement("div");
    strategyHeader.classList.add("strategy-header");

    const strategyName = document.createElement("button");
    strategyName.textContent = strategy.name;
    strategyName.classList.add("btn", "btn-link");
    strategyName.type = "button";
    strategyName.onclick = function (event) {
      event.preventDefault();
      applyStrategy(strategy);
    };

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "刪除";
    deleteButton.classList.add(
      "btn",
      "btn-outline-danger",
      "btn-sm",
      "delete-strategy"
    );
    deleteButton.type = "button";
    deleteButton.onclick = function (event) {
      event.preventDefault();
      deleteStrategy(strategy._id);
    };

    const strategyDetails = document.createElement("div");
    strategyDetails.classList.add("strategy-details");
    strategyDetails.style.display = "none";

    strategy.conditions.forEach((condition, idx) => {
      if (condition.param_1 == null) return;

      const conditionDiv = document.createElement("div");
      conditionDiv.classList.add("condition");

      let conditionContent = `
    <strong>篩選條件 ${idx + 1} ：</strong>
    <ul>
      <li>時間週期： ${condition.time_interval}</li>
      <li>篩選條件： 
      ${condition.param_1} MA
      ${condition.comparison_operator_1}
      ${condition.param_2} MA`;

      if (condition.param_3 != null) {
        conditionContent += `
      ${condition.logical_operator}
      ${condition.param_3} MA
      ${condition.comparison_operator_2}
      ${condition.param_4} MA `;
      }

      conditionContent += `</li></ul>`;
      conditionDiv.innerHTML = conditionContent;
      strategyDetails.appendChild(conditionDiv);
    });

    strategyName.addEventListener("click", function () {
      strategyDetails.style.display =
        strategyDetails.style.display === "none" ? "block" : "none";
    });

    strategiesList.appendChild(strategyDiv);
    strategyDiv.appendChild(strategyHeader);
    strategyHeader.appendChild(strategyName);
    strategyHeader.appendChild(deleteButton);
    strategyDiv.appendChild(strategyDetails);
  });
}

function displayNoStrategiesMessage() {
  const strategiesList = document.getElementById("userStrategiesList");
  strategiesList.innerHTML = "<p>尚未儲存任何策略</p>";
}

//將策略更新到篩選器
function applyStrategy(strategy) {
  // 首先清除之前的所有篩選條件
  clearFilters();

  strategy.conditions.forEach((condition, index) => {
    const groupIndex = index + 1;

    // 設置時間間隔
    document.getElementById(`time-interval-${groupIndex}`).value =
      condition.time_interval;

    // 設置參數值
    for (let j = 1; j <= 4; j++) {
      const element = document.getElementById(`MA${groupIndex}-${j}`);
      if (element) {
        element.value = condition[`param_${j}`] || "";
      }
    }

    // 設置比較運算符和邏輯運算符
    for (let j = 1; j <= 2; j++) {
      const operatorElement = document.getElementById(
        `comparison-operator-${groupIndex}-${j}`
      );
      if (operatorElement) {
        operatorElement.value = condition[`comparison_operator_${j}`] || "";
      }
    }

    const logicalOperatorElement = document.getElementById(
      `logical-operator-${groupIndex}`
    );
    if (logicalOperatorElement) {
      logicalOperatorElement.value = condition.logical_operator || "";
    }
  });
}

//清除篩選器內容
function clearFilters() {
  const parameterGroups = 4;
  for (let i = 1; i <= parameterGroups; i++) {
    document.getElementById(`time-interval-${i}`).value = "";

    for (let j = 1; j <= 4; j++) {
      const maElement = document.getElementById(`MA${i}-${j}`);
      if (maElement) maElement.value = "";
    }

    for (let j = 1; j <= 2; j++) {
      const operatorElement = document.getElementById(
        `comparison-operator-${i}-${j}`
      );
      if (operatorElement) operatorElement.value = "";
    }

    const logicalOperatorElement = document.getElementById(
      `logical-operator-${i}`
    );
    if (logicalOperatorElement) logicalOperatorElement.value = "";
  }
}

//刪除策略
function deleteStrategy(strategyId) {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/";
    return;
  }

  fetch(`/api/strategy?strategyId=${strategyId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        //console.log("策略删除成功:", strategyId);
        fetchUserStrategies();
      } else {
        console.error("策略刪除失败:", data.message);
      }
    })
    .catch((error) => {
      console.error("刪除策略時發生錯誤:", error);
    });
}

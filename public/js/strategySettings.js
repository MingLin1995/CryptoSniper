import {
  displayUserStrategies,
  displayNoStrategiesMessage,
} from "./viewHandlers.js";

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

export { fetchUserStrategies };

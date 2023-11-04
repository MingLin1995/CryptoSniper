// public/js/model.js

// 取得篩選條件
function extractFilterConditions() {
  const parameterGroups = 4;
  const intervalsData = [];

  for (let i = 1; i <= parameterGroups; i++) {
    const timeInterval = document.getElementById(`time-interval-${i}`).value;
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

  return intervalsData;
}

// 從伺服器取得K線資料
function getKlinesData(intervalsData) {
  // 僅篩選param_1不為null的資料，並取出其時間區間
  const timeIntervals = intervalsData
    .filter((interval) => interval.param_1 !== null)
    .map((interval) => interval.time_interval);

  return fetch("/api/loadKlinesData", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(timeIntervals),
  }).then((response) => response.json());
}

// 計算MA值
function calculateMA(allKlinesData, intervalsData) {
  const results = {};

  intervalsData.forEach((data, i) => {
    const timeInterval = data.time_interval;

    if (data.param_1 == null) {
      return;
    }

    const params = [data.param_1, data.param_2, data.param_3, data.param_4];
    const maxParam = Math.max(...params.filter((param) => param !== null));

    if (!results[timeInterval]) {
      results[timeInterval] = [];
    }

    allKlinesData[timeInterval].forEach((klineData) => {
      const symbol = Object.keys(klineData)[0];
      const closePrices = klineData[symbol]["closePrices"];

      if (closePrices.length < maxParam) {
        return;
      }

      // 檢查 allKlinesData[timeInterval] 是否存在
      if (!allKlinesData[timeInterval]) {
        console.error(`Error: allKlinesData[${timeInterval}] is undefined`);
        return;
      }

      const maData = {};
      params.forEach((param) => {
        if (param !== null) {
          const dataSlice = closePrices.slice(0, param);
          const ma =
            dataSlice.reduce((acc, val) => acc + val, 0) / dataSlice.length;
          maData[`MA_${param}`] = ma;
        }
      });

      results[timeInterval].push({ symbol, maData });
    });
  });

  return results;
}

// 根據MA值進行篩選
function compareMAValues(maData, intervalsData) {
  const results = {};
  for (let i = 0; i < 4; i++) {
    const interval = intervalsData[i];

    const timeInterval = interval["time_interval"];
    const param1 = interval["param_1"];
    const param2 = interval["param_2"];
    const param3 = interval["param_3"];
    const param4 = interval["param_4"];
    const comparisonOperator1 = interval["comparison_operator_1"];
    const comparisonOperator2 = interval["comparison_operator_2"];
    const logicalOperator = interval["logical_operator"];
    const allMaData = maData[timeInterval];

    if (param1 == null) {
      continue;
    }

    for (let j = 0; j < allMaData.length; j++) {
      const symbolMAData = allMaData[j];
      const symbol = symbolMAData["symbol"];
      const maData = symbolMAData["maData"];

      const ma1 = parseFloat(maData[`MA_${param1}`]);
      const ma2 = parseFloat(maData[`MA_${param2}`]);

      if (param3 === null || param4 === null) {
        const condition = eval(`${ma1} ${comparisonOperator1} ${ma2}`);
        if (Boolean(condition)) {
          if (!results[timeInterval]) {
            results[timeInterval] = [];
          }

          results[timeInterval].push({ symbol });
        }
      } else {
        const ma3 = parseFloat(maData[`MA_${param3}`]);
        const ma4 = parseFloat(maData[`MA_${param4}`]);

        const condition1 = eval(`${ma1} ${comparisonOperator1} ${ma2}`);
        const condition2 = eval(`${ma3} ${comparisonOperator2} ${ma4}`);

        let condition;
        if (logicalOperator === "and") {
          condition = condition1 && condition2;
        } else if (logicalOperator === "or") {
          condition = condition1 || condition2;
        }

        if (Boolean(condition)) {
          if (!results[timeInterval]) {
            results[timeInterval] = [];
          }

          results[timeInterval].push({ symbol });
        }
      }
    }
  }
  return results;
}

// 取得標的的交集
function findIntersection(matchingData, intervalsData) {
  const symbolArrays = [];
  const count = intervalsData.filter((item) => item.param_1 !== null).length;

  for (let i = 0; i < count; i++) {
    const interval = intervalsData[i]["time_interval"];
    const symbolsForInterval = matchingData[interval].map(
      (item) => item["symbol"]
    );
    symbolArrays.push(symbolsForInterval);
  }
  // 如果只有一個陣列，則直接返回該陣列
  if (symbolArrays.length === 1) {
    return symbolArrays[0];
  }

  // 否則取得所有陣列的交集
  const intersection = symbolArrays.reduce((acc, currArray) => {
    return acc.filter((symbol) => currArray.includes(symbol));
  });

  return intersection;
}

// 從伺服器取得成交量資料
function getResultsVolume(results) {
  return fetch("/api/loadVolumeData", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(results),
  }).then((response) => {
    if (!response.ok) {
      // 若伺服器響應不是 2xx，抛出錯誤
      return response.json().then((err) => {
        throw new Error(err.message);
      });
    }
    return response.json(); //會出現錯誤，是因為五分鐘更新一次，所以抓日線資料，會沒有成交量
  });
}

// 格式化顯示成交量
function formatVolume(volume) {
  if (volume >= 100000000) {
    // 如果成交量大於億，則以1億為單位
    const formattedVolume = (volume / 100000000).toFixed(2) + "億";
    return formattedVolume;
  } else if (volume >= 10000) {
    // 如果成交量大於萬，則以萬為單位
    const formattedVolume = (volume / 10000).toFixed(2) + "萬";
    return formattedVolume;
  } else {
    // 如果成交量小於萬，顯示原始值
    return volume;
  }
}

// 顯示結果在前端
function displayResults(allResultsVolume) {
  const tbody = document.getElementById("results-tbody"); // 更改此行
  tbody.innerHTML = ""; // 清空現有的内容

  if (allResultsVolume.length === 0) {
    const tr = document.createElement("tr");
    const tdMessage = document.createElement("td");
    tdMessage.colSpan = 2;
    tdMessage.textContent = "查無任何標的";
    tr.appendChild(tdMessage);
    tbody.appendChild(tr); // 修正此处
    return;
  }

  let currentIndex = 0;

  const loadMore = () => {
    const endIndex = Math.min(currentIndex + 10, allResultsVolume.length);
    for (; currentIndex < endIndex; currentIndex++) {
      const item = allResultsVolume[currentIndex];
      const tr = document.createElement("tr");
      const tdSymbol = document.createElement("td");
      tdSymbol.textContent = item.symbol;
      const tdVolume = document.createElement("td");
      tdVolume.textContent = formatVolume(item.quote_volume);
      tr.appendChild(tdSymbol);
      tr.appendChild(tdVolume);
      tbody.appendChild(tr);
    }

    if (currentIndex >= allResultsVolume.length) {
      const tr = document.createElement("tr");
      const tdEndMessage = document.createElement("td");
      tdEndMessage.colSpan = 2;
      tdEndMessage.textContent = "沒有更多資料了";
      tr.appendChild(tdEndMessage);
      tbody.appendChild(tr); // 修正此处
    }
  };

  loadMore();

  // 移除舊的滾動事件監聽器
  window.onscroll = null;
  window.onscroll = function () {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 5 &&
      currentIndex < allResultsVolume.length
    ) {
      loadMore();
    }
  };

  // 排序功能
  const volumeHeader = document.getElementById("volume-header");
  let isAscending = false;
  volumeHeader.onclick = null;
  volumeHeader.onclick = () => {
    isAscending = !isAscending;
    allResultsVolume.sort((a, b) =>
      isAscending
        ? a.quote_volume - b.quote_volume
        : b.quote_volume - a.quote_volume
    );
    tbody.innerHTML = ""; // 清空當前的結果，修正此处
    currentIndex = 0; // 重設索引
    loadMore(); // 重新載入數據
  };
}

export {
  extractFilterConditions,
  getKlinesData,
  calculateMA,
  compareMAValues,
  findIntersection,
  getResultsVolume,
  displayResults,
};

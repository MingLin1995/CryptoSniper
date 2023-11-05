// public/js/model.js
import { createTradingViewWidget } from "./tradingViewConfig.js";

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

//建立表格
function createTableRow(item, intervalsData) {
  // 創建一個表格行並填充數據
  const tr = document.createElement("tr");

  // 創建標的名稱的列
  const tdSymbol = document.createElement("td");
  tdSymbol.textContent = item.symbol;
  tdSymbol.id = "symbol-column";
  tdSymbol.addEventListener("click", function () {
    handleSymbolClick(item.symbol, intervalsData);
  });

  // 創建交易量的列
  const tdVolume = document.createElement("td");
  tdVolume.textContent = formatVolume(item.quote_volume);

  // 將這兩列添加到行中
  tr.appendChild(tdSymbol);
  tr.appendChild(tdVolume);

  return tr; // 返回已創建的行
}

// 點擊標的
function handleSymbolClick(symbol, intervalsData) {
  const clickedSymbol = `BINANCE:${symbol}.P`;
  createTradingViewWidget(intervalsData, clickedSymbol);
  document.getElementById("targetSymbol").value = symbol;

  // 增加一個延遲，以確保頁面已經動態加載並渲染
  setTimeout(() => {
    const targetElement = document.getElementById("tradingViewContainer");

    targetElement.style.display = "block";

    // 獲取元素相對於視窗的位置
    const rect = targetElement.getBoundingClientRect();
    const offset = rect.top + window.scrollY;

    // 計算並滾動到元素應該在的位置
    const offsetPosition =
      offset - window.innerHeight / 2 + targetElement.clientHeight / 2;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }, 100);
}

// 載入更多
function loadMoreResults(
  tbody,
  allResultsVolume,
  intervalsData,
  currentIndex,
  loadCount
) {
  // 載入更多的結果到表格中
  const endIndex = Math.min(currentIndex + loadCount, allResultsVolume.length);

  for (; currentIndex < endIndex; currentIndex++) {
    const item = allResultsVolume[currentIndex];
    const tr = createTableRow(item, intervalsData);
    tbody.appendChild(tr);
  }

  if (currentIndex >= allResultsVolume.length) {
    const tr = document.createElement("tr");
    const tdEndMessage = document.createElement("td");
    tdEndMessage.colSpan = 2;
    tdEndMessage.textContent = "沒有更多資料了";
    tr.appendChild(tdEndMessage);
    tbody.appendChild(tr);
  }

  return currentIndex; // 返回新的currentIndex值
}

// 排序功能
function sortResultsByVolume(allResultsVolume, isAscending) {
  return allResultsVolume.sort((a, b) =>
    isAscending
      ? a.quote_volume - b.quote_volume
      : b.quote_volume - a.quote_volume
  );
}

// 滾動加載功能
function handleScroll(
  tbody,
  allResultsVolume,
  intervalsData,
  currentIndex,
  loadCount
) {
  window.onscroll = function () {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 5 &&
      currentIndex < allResultsVolume.length
    ) {
      currentIndex = loadMoreResults(
        tbody,
        allResultsVolume,
        intervalsData,
        currentIndex,
        loadCount
      );
    }
  };
}

// 前端畫面顯示
function displayResults(allResultsVolume, intervalsData) {
  const tbody = document.getElementById("results-tbody");
  tbody.innerHTML = "";
  let currentIndex = 0;
  const loadCount = 10;

  // 排序功能
  const volumeHeader = document.getElementById("volume-header");
  let isAscending = false;
  volumeHeader.onclick = () => {
    isAscending = !isAscending;
    allResultsVolume = sortResultsByVolume(allResultsVolume, isAscending);
    tbody.innerHTML = ""; // 清空當前的表格內容
    currentIndex = 0; // 重置currentIndex為0
    currentIndex = loadMoreResults(
      tbody,
      allResultsVolume,
      intervalsData,
      currentIndex,
      loadCount
    ); // 重新加載並顯示排序後的結果
  };

  currentIndex = loadMoreResults(
    tbody,
    allResultsVolume,
    intervalsData,
    currentIndex,
    loadCount
  );

  // 滾動加載功能
  handleScroll(tbody, allResultsVolume, intervalsData, currentIndex, loadCount);
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

// public/model.js

function extractFilterConditions() {
  //總共四組參數
  const parameterGroups = 4;

  const intervalsData = [];
  // 清空 intervalsData
  intervalsData.length = 0;

  for (let i = 1; i <= parameterGroups; i++) {
    //時框
    const timeInterval = document.getElementById(`time-interval-${i}`).value;
    //MA的值
    const maParameters = [];
    //比較方法
    const comparisonOperator = [];

    //是否多重比較
    const logicalOperator = document.getElementById(
      `logical-operator-${i}`
    ).value;

    for (let j = 1; j <= parameterGroups; j++) {
      const maParamValue = document.getElementById(`MA${i}-${j}`).value;
      // 轉換為整數，否則為null
      const maParam = maParamValue ? parseInt(maParamValue) : null;
      maParameters.push({
        value: maParam,
      });
    }

    for (let j = 1; j <= 2; j++) {
      comparisonOperator.push({
        comparisonOperator: document.getElementById(
          `comparison-operator-${i}-${j}`
        ).value,
      });
    }

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

function getKlinesData(intervalsData) {
  const timeIntervals = intervalsData
    .filter((interval) => interval.param_1 !== null) // 使用 filter 过滤 param_1 不为 null 的项
    .map((interval) => interval.time_interval); // 提取所有的 time_interval 值
  //console.log(timeIntervals);

  return fetch("/api/loadKlinesData", {
    method: "POST", // 使用POST方法发送数据
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(timeIntervals), // 将条件数据作为JSON发送
  })
    .then((response) => response.json())
    .then((allKlinesData) => {
      //console.log(allKlinesData);
      // 在这里处理从后端获取的K线数据
      //processKlinesData(klinesData);
      //console.log(allKlinesData);
      return allKlinesData;
    })
    .catch((error) => {
      //console.error("Error:", error); // 处理错误
    });
}

function calculateMA(allKlinesData, intervalsData) {
  const results = {};

  //總共四組intervalsData
  for (let i = 0; i < intervalsData.length; i++) {
    const data = intervalsData[i];
    //console.log(data.time_interval);
    const timeInterval = data.time_interval;

    if (data.param_1 == null) {
      continue;
    }

    //MA參數
    const params = [];
    for (let i = 1; i <= 4; i++) {
      const param = data[`param_${i}`];
      params.push(param);
    }

    if (!results[timeInterval]) {
      results[timeInterval] = []; // 如果不存在該時間區間的結果，創建一個空數組
    }

    //個別取出標的以及收盤價
    for (let i = 0; i < allKlinesData[timeInterval].length; i++) {
      const symbol = Object.keys(allKlinesData[timeInterval][i])[0];
      const closePrices = allKlinesData[timeInterval][i][symbol]["closePrices"];
      const maxParam = Math.max(...params.filter((param) => param !== null));
      if (closePrices.length < maxParam) {
        continue;
      }

      const maData = {};

      for (const param of params) {
        if (param !== null) {
          //取出對應param數量的K棒
          const dataSlice = closePrices.slice(0, param);
          const ma =
            dataSlice.reduce((acc, val) => acc + val, 0) / dataSlice.length;
          maData[`MA_${param}`] = ma;
        }
      }
      //console.log(timeInterval, symbol, maData);
      results[timeInterval].push({ symbol, maData });
    }
    //console.log(results);
  }

  return results;
}

// MA筛选
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

    //console.log(allMaData);
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

//取交集
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

function getResultsVolume(results) {
  return fetch("/api/loadVolumeData", {
    method: "POST", // 使用POST方法发送数据
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(results), // 将条件数据作为JSON发送
  })
    .then((response) => response.json())
    .then((ResultsVolume) => {
      return ResultsVolume;
    })
    .catch((error) => {
      console.error("Error:", error); // 处理错误
    });
}

function displayResults(allResultsVolume) {
  const messageDiv = document.getElementById("message");
  messageDiv.innerHTML = ""; // 清空先前的內容

  if (allResultsVolume.length === 0) {
    messageDiv.textContent = "查無任何標的";
    return;
  }

  allResultsVolume.forEach((item) => {
    const p = document.createElement("p");
    const volume = formatVolume(item.quote_volume);
    p.textContent = "標的：" + item.symbol + " 成交量：" + volume;
    messageDiv.appendChild(p);
  });
}
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

//導出
export {
  extractFilterConditions,
  getKlinesData,
  calculateMA,
  compareMAValues,
  findIntersection,
  getResultsVolume,
  displayResults,
};

// public/js/model.js

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
        const condition = compare(ma1, comparisonOperator1, ma2);
        if (Boolean(condition)) {
          if (!results[timeInterval]) {
            results[timeInterval] = [];
          }

          results[timeInterval].push({ symbol });
        }
      } else {
        const ma3 = parseFloat(maData[`MA_${param3}`]);
        const ma4 = parseFloat(maData[`MA_${param4}`]);

        const condition1 = compare(ma1, comparisonOperator1, ma2);
        const condition2 = compare(ma3, comparisonOperator2, ma4);

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

//判斷函式
function compare(ma1, operator, ma2) {
  switch (operator) {
    case "<":
      return ma1 < ma2;
    case "<=":
      return ma1 <= ma2;
    case ">":
      return ma1 > ma2;
    case ">=":
      return ma1 >= ma2;
    case "==":
      return ma1 == ma2;
    case "!=":
      return ma1 != ma2;
    default:
      throw new Error("Invalid comparison operator");
  }
}

// 取得標的的交集
function findIntersection(matchingData, intervalsData) {
  const symbolArrays = [];
  // 只考慮那些 param_1 不為 null 的時間週期
  const activeIntervals = intervalsData.filter((item) => item.param_1 !== null);
  const count = activeIntervals.length;

  // 檢查 matchingData 是否包含 activeIntervals 定義的所有時間週期
  const intervals = activeIntervals.map((interval) => interval.time_interval);
  const availableIntervals = Object.keys(matchingData);
  const isAllIntervalsAvailable = intervals.every((interval) =>
    availableIntervals.includes(interval)
  );

  if (!isAllIntervalsAvailable) {
    // 如果有時間週期沒資料，直接返回空陣列（因為一定不會有交集）
    return [];
  }

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

export { calculateMA, compareMAValues, findIntersection };

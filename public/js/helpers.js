// public/js/helpers.js

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

// 排序功能
function sortResultsByVolume(allResultsVolume, isAscending) {
  return allResultsVolume.sort((a, b) =>
    isAscending
      ? a.quote_volume - b.quote_volume
      : b.quote_volume - a.quote_volume
  );
}

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

export { extractFilterConditions, sortResultsByVolume, formatVolume };

function processForm() {
  const messageElement = document.getElementById("message");
  messageElement.innerHTML = "搜尋中...";

  const intervalsData = [];
  // 清空 intervalsData
  intervalsData.length = 0;

  const parameterGroups = 4;

  for (let i = 1; i <= parameterGroups; i++) {
    const timeInterval = document.getElementById(`time-interval-${i}`).value;
    const maParameters = [];
    const comparisonOperator = [];
    const logicalOperator = document.getElementById(
      `logical-operator-${i}`
    ).value;

    for (let j = 1; j <= 4; j++) {
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

  console.log(intervalsData);

  fetch("/api/screener", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(intervalsData),
  })
    .then((response) => response.json())
    .then((data) => {
      messageElement.innerHTML = "";

      if (data.message.length === 0) {
        const noDataElement = document.createElement("div");
        noDataElement.textContent = "查無任何標的";
        messageElement.appendChild(noDataElement);
      } else {
        //console.log(data.message);

        // 成交量大到小
        data.message.sort((a, b) => b.成交量 - a.成交量);

        data.message.forEach((item) => {
          const newItemElement = document.createElement("div");
          newItemElement.innerHTML = `標的：${
            item["標的"]
          }，成交量：${formatVolume(item.成交量)}`;
          messageElement.appendChild(newItemElement);
        });
      }
    })
    .catch((error) => {
      messageElement.innerHTML = ""; // 清空messageElement
      messageElement.innerHTML =
        "該時間週期資料庫更新中，請稍後再試試或是換個時框";
      console.error("Error:", error);
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
    return volume.toFixed(2);
  }
}

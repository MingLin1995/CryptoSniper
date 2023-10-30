// public/index.js

import {
  extractFilterConditions,
  getKlinesData,
  calculateMA,
  compareMAValues,
  findIntersection,
  getResultsVolume,
  displayResults,
} from "./model.js";

const submitButton = document.querySelector(".filterForm");
submitButton.addEventListener("click", processForm);

//取得前端數據
async function processForm() {
  const intervalsData = extractFilterConditions(); // 取得所有篩選條件
  //console.log(intervalsData); // 仅用于调试

  try {
    const allKlinesData = await getKlinesData(intervalsData); // 取得K線資料
    //console.log(allKlinesData); // 在异步操作完成后打印数据
    const maResults = calculateMA(allKlinesData, intervalsData);
    const matchingData = compareMAValues(maResults, intervalsData);
    const results = findIntersection(matchingData, intervalsData);
    const allResultsVolume = await getResultsVolume(results);
    //console.log(allResultsVolume);
    displayResults(allResultsVolume);

    //console.log(results);
    // 在此处可以处理或渲染数据到页面
  } catch (error) {
    console.error("Error:", error); // 处理错误
  }
}

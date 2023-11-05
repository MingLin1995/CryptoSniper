// public/js/tradingViewConfig.js

// 時間間隔
const time_intervals = {
  "5m": 5,
  "15m": 15,
  "30m": 30,
  "1h": 60,
  "2h": 120,
  "4h": 240,
  //"6h": 360,
  //"8h": 480,
  //"12h": 720,
  "1d": "D",
  //"3d": "3D",
  "1w": "W",
  "1M": "M",
};

function createTradingViewWidget(intervalsData, symbol = "BINANCE:BTCUSDT.P") {
  const tradingViewContainer = document.getElementById("tradingViewContainer");
  tradingViewContainer.style.display = "block";

  // 計算容器高度
  const containerHeight = document.querySelector(
    ".tradingview-widget-container"
  ).offsetHeight;

  const intervalData = intervalsData[0];
  const timeInterval = intervalData["time_interval"];
  const param1 = intervalData["param_1"];
  const param2 = intervalData["param_2"];
  const param3 = intervalData["param_3"];
  const param4 = intervalData["param_4"];

  const studies = [];

  // 根據 param 的值動態新增 studies
  if (param1 !== null) {
    studies.push({
      name: `Moving Average ${param1}`,
      id: "MASimple@tv-basicstudies",
      type: "moving_average",
      inputs: {
        length: param1,
      },
    });
  }

  if (param2 !== null) {
    studies.push({
      name: `Moving Average ${param2}`,
      id: "MASimple@tv-basicstudies",
      type: "moving_average",
      inputs: {
        length: param2,
      },
    });
  }

  if (param3 !== null) {
    studies.push({
      name: `Moving Average ${param3}`,
      id: "MASimple@tv-basicstudies",
      type: "moving_average",
      inputs: {
        length: param3,
      },
    });
  }

  if (param4 !== null) {
    studies.push({
      name: `Moving Average ${param4}`,
      id: "MASimple@tv-basicstudies",
      type: "moving_average",
      inputs: {
        length: param4,
      },
    });
  }

  // 取得對應時匡的值
  const timeIntervalKey = timeInterval;
  const interval = time_intervals[timeIntervalKey];

  new TradingView.widget({
    width: "100%",
    height: containerHeight,
    symbol: symbol,
    interval: interval.toString(),
    timezone: "Asia/Taipei",
    theme: "dark",
    style: "1",
    locale: "zh_TW",
    enable_publishing: false, //禁用發布圖表功能
    allow_symbol_change: true, //啟用更改交易對功能
    container_id: "tradingview_0aab0", //圖表容器ID
    studies: studies,
  });
}

export { createTradingViewWidget };

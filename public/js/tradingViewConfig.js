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

//建立K線圖表
function generateStudies(params) {
  const studies = [];
  params.forEach((param) => {
    if (param !== null) {
      studies.push({
        name: `Moving Average ${param}`,
        id: "MASimple@tv-basicstudies",
        type: "moving_average",
        inputs: {
          length: param,
        },
      });
    }
  });
  return studies;
}

function createTradingViewWidget(intervalsData, symbol = "BINANCE:BTCUSDT.P") {
  const tradingViewContainer = document.getElementById("tradingViewContainer");
  tradingViewContainer.style.display = "block";

  const intervalData = intervalsData[0];
  const { time_interval, param_1, param_2, param_3, param_4 } = intervalData;

  const studies = generateStudies([param_1, param_2, param_3, param_4]);
  const interval = time_intervals[time_interval];

  new TradingView.widget({
    width: "100%",
    height: tradingViewContainer.offsetHeight,
    symbol: symbol,
    interval: interval.toString(),
    timezone: "Asia/Taipei",
    theme: "dark",
    style: "1",
    locale: "zh_TW",
    enable_publishing: false,
    allow_symbol_change: true,
    container_id: "tradingview_0aab0",
    studies: studies,
  });
}

export { createTradingViewWidget };

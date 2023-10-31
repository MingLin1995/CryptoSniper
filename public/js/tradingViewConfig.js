new TradingView.widget({
  width: 850,
  height: 550,
  symbol: "BINANCE:BTCUSDT.P",
  interval: "15", //15 60 240
  timezone: "Asia/Taipei",
  theme: "dark",
  style: "1",
  locale: "zh_TW",
  enable_publishing: false, //禁用發布圖表功能
  allow_symbol_change: true, //啟用更改交易對功能
  container_id: "tradingview_0aab0", //圖表容器ID
  studies: [
    {
      name: "Moving Average 25",
      id: "MASimple@tv-basicstudies",
      type: "moving_average",
      inputs: {
        length: 25,
      },
    },
    {
      name: "Moving Average 60",
      id: "MASimple@tv-basicstudies",
      type: "moving_average",
      inputs: {
        length: 60,
      },
    },
    {
      name: "Moving Average 99",
      id: "MASimple@tv-basicstudies",
      type: "moving_average",
      inputs: {
        length: 99,
      },
    },
  ],
});

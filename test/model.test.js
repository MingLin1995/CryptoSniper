// test/model.test.js

const {
  calculateMA,
  compareMAValues,
  findIntersection,
} = require("../public/js/model");

//MA計算測試
describe("calculateMA function", () => {
  it("正常數據測試", () => {
    const allKlinesData = {
      "15m": [
        {
          BTCUSDT: {
            closePrices: [100, 105, 110, 115, 120, 125, 130, 135, 140, 145],
          },
        },
        {
          ETHUSDT: {
            closePrices: [200, 205, 210, 215, 220, 225, 230, 235, 240, 245],
          },
        },
      ],
      "1h": [
        {
          BTCUSDT: {
            closePrices: [100, 105, 110, 115, 120, 125, 130, 135, 140, 145],
          },
        },
        {
          ETHUSDT: {
            closePrices: [200, 205, 210, 215, 220, 225, 230, 235, 240, 245],
          },
        },
      ],
    };
    const intervalsData = [
      {
        time_interval: "15m",
        param_1: 3,
        param_2: null,
        param_3: null,
        param_4: null,
      },
      {
        time_interval: "1h",
        param_1: 5,
        param_2: null,
        param_3: null,
        param_4: null,
      },
      {
        time_interval: "4h",
        param_1: null,
        param_2: null,
        param_3: null,
        param_4: null,
      },
      {
        time_interval: "1d",
        param_1: null,
        param_2: null,
        param_3: null,
        param_4: null,
      },
    ];

    // 執行
    const result = calculateMA(allKlinesData, intervalsData);

    // 預期結果
    const expected = {
      "15m": [
        { symbol: "BTCUSDT", maData: { MA_3: (100 + 105 + 110) / 3 } },
        { symbol: "ETHUSDT", maData: { MA_3: (200 + 205 + 210) / 3 } },
      ],
      "1h": [
        {
          symbol: "BTCUSDT",
          maData: { MA_5: (100 + 105 + 110 + 115 + 120) / 5 },
        },
        {
          symbol: "ETHUSDT",
          maData: { MA_5: (200 + 205 + 210 + 215 + 220) / 5 },
        },
      ],
    };

    // 檢查執行結果與預期結果是否一樣
    expect(result).toEqual(expected);
  });

  it("空數據測試", () => {
    const allKlinesData = { "15m": [], "1h": [] };
    const intervalsData = [
      {
        time_interval: "15m",
        param_1: 3,
        param_2: null,
        param_3: null,
        param_4: null,
      },
      {
        time_interval: "1h",
        param_1: 5,
        param_2: null,
        param_3: null,
        param_4: null,
      },
      {
        time_interval: "4h",
        param_1: null,
        param_2: null,
        param_3: null,
        param_4: null,
      },
      {
        time_interval: "1d",
        param_1: null,
        param_2: null,
        param_3: null,
        param_4: null,
      },
    ];

    const result = calculateMA(allKlinesData, intervalsData);

    const expected = { "15m": [], "1h": [] };

    expect(result).toEqual(expected);
  });

  it("數據不足測試", () => {
    const allKlinesData = {
      "15m": [{ BTCUSDT: { closePrices: [100, 105] } }],
      "1h": [{ BTCUSDT: { closePrices: [103, 108] } }],
    };
    const intervalsData = [
      {
        time_interval: "15m",
        param_1: 3,
        param_2: null,
        param_3: null,
        param_4: null,
      },
      {
        time_interval: "1h",
        param_1: 5,
        param_2: null,
        param_3: null,
        param_4: null,
      },
      {
        time_interval: "4h",
        param_1: null,
        param_2: null,
        param_3: null,
        param_4: null,
      },
      {
        time_interval: "1d",
        param_1: null,
        param_2: null,
        param_3: null,
        param_4: null,
      },
    ];

    const result = calculateMA(allKlinesData, intervalsData);

    const expected = { "15m": [], "1h": [] };

    expect(result).toEqual(expected);
  });

  it("邊界值測試", () => {
    const allKlinesData = {
      "15m": [{ BTCUSDT: { closePrices: [100, 105, 110] } }],
    };
    const intervalsData = [
      {
        time_interval: "15m",
        param_1: 3,
        param_2: null,
        param_3: null,
        param_4: null,
      },
      {
        time_interval: "1h",
        param_1: null,
        param_2: null,
        param_3: null,
        param_4: null,
      },
      {
        time_interval: "4h",
        param_1: null,
        param_2: null,
        param_3: null,
        param_4: null,
      },
      {
        time_interval: "1d",
        param_1: null,
        param_2: null,
        param_3: null,
        param_4: null,
      },
    ];

    const result = calculateMA(allKlinesData, intervalsData);
    const expected = {
      "15m": [{ symbol: "BTCUSDT", maData: { MA_3: (100 + 105 + 110) / 3 } }],
    };

    expect(result).toEqual(expected);
  });

  //四個時間週期，每個週期五萬筆標的，每個標的100萬筆收盤價
  it("性能测试", () => {
    //隨機標的名稱
    function getRandomSymbol() {
      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let symbol = "";
      for (let i = 0; i < 6; i++) {
        symbol += letters.charAt(Math.floor(Math.random() * letters.length));
      }
      return symbol;
    }

    //每個標的有5萬筆收盤價
    const largeNumberOfDataPoints = 50000;
    const largeClosePricesArray = new Array(largeNumberOfDataPoints)
      .fill(0)
      .map(() => Math.random() * 100);

    const timeIntervals = [
      "5m",
      "15m",
      "30m",
      "1h",
      "2h",
      "4h",
      "1d",
      "1w",
      "1M",
    ];

    //每個時間間隔有五萬筆標的
    const allKlinesData = timeIntervals.reduce((acc, interval) => {
      acc[interval] = Array.from({ length: 50000 }, () => ({
        [getRandomSymbol()]: { closePrices: largeClosePricesArray },
      }));
      return acc;
    }, {});

    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    const intervalsData = [
      {
        time_interval: "15m",
        param_1: getRandomInt(1, 240),
        param_2: getRandomInt(1, 240),
        param_3: getRandomInt(1, 240),
        param_4: getRandomInt(1, 240),
      },

      {
        time_interval: "1h",
        param_1: getRandomInt(1, 240),
        param_2: getRandomInt(1, 240),
        param_3: getRandomInt(1, 240),
        param_4: getRandomInt(1, 240),
      },

      {
        time_interval: "4h",
        param_1: getRandomInt(1, 240),
        param_2: getRandomInt(1, 240),
        param_3: getRandomInt(1, 240),
        param_4: getRandomInt(1, 240),
      },
      {
        time_interval: "1d",
        param_1: getRandomInt(1, 240),
        param_2: getRandomInt(1, 240),
        param_3: getRandomInt(1, 240),
        param_4: getRandomInt(1, 240),
      },
    ];
  });
});

//比較判斷測試
describe("compareMAValues function", () => {
  it("正常判斷測試", () => {
    const maData = {
      "15m": [
        {
          symbol: "BTCUSDT",
          maData: { MA_25: 100, MA_60: 105, MA_80: 150, MA_99: 105 },
        },
        {
          symbol: "ETHUSDT",
          maData: { MA_25: 165, MA_60: 50, MA_80: 150, MA_99: 105 },
        },
        {
          symbol: "BNBUSDT",
          maData: { MA_25: 50, MA_60: 100, MA_80: 150, MA_99: 105 },
        },
      ],
      "1h": [
        {
          symbol: "BTCUSDT",
          maData: { MA_25: 100, MA_60: 105, MA_80: 150, MA_99: 105 },
        },
        {
          symbol: "ETHUSDT",
          maData: { MA_25: 165, MA_60: 50, MA_80: 150, MA_99: 105 },
        },
        {
          symbol: "BNBUSDT",
          maData: { MA_25: 50, MA_60: 100, MA_80: 150, MA_99: 105 },
        },
      ],
      "4h": [
        {
          symbol: "BTCUSDT",
          maData: { MA_25: 110, MA_60: 105, MA_80: 150, MA_99: 105 },
        },
        {
          symbol: "ETHUSDT",
          maData: { MA_25: 165, MA_60: 50, MA_80: 150, MA_99: 105 },
        },
        {
          symbol: "BNBUSDT",
          maData: { MA_25: 110, MA_60: 100, MA_80: 150, MA_99: 105 },
        },
      ],
      "1d": [
        {
          symbol: "BTCUSDT",
          maData: { MA_25: 100, MA_60: 105 },
        },
        {
          symbol: "ETHUSDT",
          maData: { MA_25: 165, MA_60: 50 },
        },
        { symbol: "BNBUSDT", maData: { MA_25: 50, MA_60: 100 } },
      ],
    };
    const intervalsData = [
      {
        comparison_operator_1: "<",
        comparison_operator_2: ">",
        logical_operator: "and",
        param_1: 25,
        param_2: 60,
        param_3: 80,
        param_4: 99,
        time_interval: "15m",
      },
      {
        comparison_operator_1: ">",
        comparison_operator_2: ">",
        logical_operator: "or",
        param_1: 25,
        param_2: 60,
        param_3: 80,
        param_4: 99,
        time_interval: "1h",
      },
      {
        comparison_operator_1: ">",
        comparison_operator_2: "<",
        logical_operator: "or",
        param_1: 25,
        param_2: 60,
        param_3: 80,
        param_4: 99,
        time_interval: "4h",
      },
      {
        comparison_operator_1: ">",
        comparison_operator_2: ">",
        logical_operator: "or",
        param_1: 25,
        param_2: 60,
        param_3: null,
        param_4: null,
        time_interval: "1d",
      },
    ];

    const result = compareMAValues(maData, intervalsData);
    const expected_15m = [{ symbol: "BTCUSDT" }, { symbol: "BNBUSDT" }];
    const expected_1h = [
      { symbol: "BTCUSDT" },
      { symbol: "BNBUSDT" },
      { symbol: "ETHUSDT" },
    ];
    const expected_4h = [
      { symbol: "BTCUSDT" },
      { symbol: "BNBUSDT" },
      { symbol: "ETHUSDT" },
    ];
    const expected_1d = [{ symbol: "ETHUSDT" }];

    expect(result["15m"]).toEqual(expect.arrayContaining(expected_15m));
    expect(result["1h"]).toEqual(expect.arrayContaining(expected_1h));
    expect(result["4h"]).toEqual(expect.arrayContaining(expected_4h));
    expect(result["1d"]).toEqual(expect.arrayContaining(expected_1d));
  });

  it("邏輯運算判斷測試", () => {
    const maData = {
      "1h": [
        {
          symbol: "BTCUSDT",
          maData: { MA_10: 100, MA_20: 90, MA_30: 95, MA_40: 150 },
        },
        {
          symbol: "ETHUSDT",
          maData: { MA_10: 80, MA_20: 85, MA_30: 75, MA_40: 70 },
        },
      ],
    };
    const intervalsData = [
      {
        time_interval: "1h",
        param_1: 10,
        param_2: 20,
        comparison_operator_1: ">",
        param_3: 30,
        param_4: 40,
        comparison_operator_2: "<",
        logical_operator: "or",
      },
      {
        comparison_operator_1: "<",
        comparison_operator_2: ">",
        logical_operator: "and",
        param_1: null,
        param_2: null,
        param_3: null,
        param_4: null,
        time_interval: "15m",
      },
      {
        comparison_operator_1: ">",
        comparison_operator_2: ">",
        logical_operator: "and",
        param_1: null,
        param_2: null,
        param_3: null,
        param_4: null,
        time_interval: "1d",
      },
      {
        comparison_operator_1: "<",
        comparison_operator_2: ">",
        logical_operator: "and",
        param_1: null,
        param_2: null,
        param_3: null,
        param_4: null,
        time_interval: "4h",
      },
    ];

    const result = compareMAValues(maData, intervalsData);
    const expected_1h = [{ symbol: "BTCUSDT" }];

    expect(result["1h"]).toEqual(expect.arrayContaining(expected_1h));
  });

  it("部分參數為空測試", () => {
    const maData = {
      "1h": [
        { symbol: "BTCUSDT", maData: { MA_10: 100, MA_20: 90 } },
        { symbol: "ETHUSDT", maData: { MA_10: 80, MA_20: 85 } },
      ],
    };
    const intervalsData = [
      {
        time_interval: "1h",
        param_1: 10,
        param_2: 20,
        comparison_operator_1: "<",
        param_3: null,
        param_4: null,
      },
      {
        comparison_operator_1: ">",
        comparison_operator_2: ">",
        logical_operator: "and",
        param_1: null,
        param_2: 60,
        param_3: null,
        param_4: null,
        time_interval: "15m",
      },
      {
        comparison_operator_1: "<",
        comparison_operator_2: ">",
        logical_operator: "and",
        param_1: null,
        param_2: 60,
        param_3: null,
        param_4: null,
        time_interval: "4h",
      },
      {
        comparison_operator_1: ">",
        comparison_operator_2: ">",
        logical_operator: "and",
        param_1: null,
        param_2: 60,
        param_3: null,
        param_4: null,
        time_interval: "1d",
      },
    ];

    const result = compareMAValues(maData, intervalsData);
    const expected = [{ symbol: "ETHUSDT" }];

    expect(result["1h"]).toEqual(expect.arrayContaining(expected));
  });

  it("沒有符合條件資料測試", () => {
    const maData = {
      "1h": [
        { symbol: "BTCUSDT", maData: { MA_10: 100, MA_20: 110 } },
        { symbol: "ETHUSDT", maData: { MA_10: 80, MA_20: 85 } },
      ],
    };
    const intervalsData = [
      {
        time_interval: "1h",
        param_1: 10,
        param_2: 20,
        comparison_operator_1: ">",
        param_3: null,
        param_4: null,
      },
      {
        comparison_operator_1: ">",
        comparison_operator_2: ">",
        logical_operator: "and",
        param_1: null,
        param_2: 60,
        param_3: null,
        param_4: null,
        time_interval: "15m",
      },
      {
        comparison_operator_1: "<",
        comparison_operator_2: ">",
        logical_operator: "and",
        param_1: null,
        param_2: 60,
        param_3: null,
        param_4: null,
        time_interval: "4h",
      },
      {
        comparison_operator_1: ">",
        comparison_operator_2: ">",
        logical_operator: "and",
        param_1: null,
        param_2: 60,
        param_3: null,
        param_4: null,
        time_interval: "1d",
      },
    ];

    const result = compareMAValues(maData, intervalsData);
    expect(result["1h"]).toEqual();
  });
});

//取交集測試
describe("findIntersection function", () => {
  it("單一時間間隔的數據取交集", () => {
    const matchingData = {
      "1h": [{ symbol: "BTCUSDT" }, { symbol: "ETHUSDT" }],
    };
    const intervalsData = [{ time_interval: "1h", param_1: 25 }];

    const result = findIntersection(matchingData, intervalsData);
    expect(result).toEqual(["BTCUSDT", "ETHUSDT"]);
  });

  it("多個時間間隔的數據取交集", () => {
    const matchingData = {
      "1h": [{ symbol: "BTCUSDT" }, { symbol: "ETHUSDT" }],
      "4h": [{ symbol: "BTCUSDT" }, { symbol: "BNBUSDT" }],
    };
    const intervalsData = [
      { time_interval: "1h", param_1: 25 },
      { time_interval: "4h", param_1: 60 },
    ];

    const result = findIntersection(matchingData, intervalsData);
    expect(result).toEqual(["BTCUSDT"]);
  });

  it("多個時間週期，沒有相符的數據", () => {
    const matchingData = {
      "1h": [{ symbol: "ETHUSDT" }],
      "4h": [{ symbol: "BNBUSDT" }],
    };
    const intervalsData = [
      { time_interval: "1h", param_1: 25 },
      { time_interval: "4h", param_1: 60 },
    ];

    const result = findIntersection(matchingData, intervalsData);
    expect(result).toEqual([]);
  });

  it("多個時間週期，其中一個週期為空值", () => {
    const matchingData = {
      "4h": [{ symbol: "BNBUSDT" }],
    };
    const intervalsData = [
      { time_interval: "1h", param_1: 25 },
      { time_interval: "4h", param_1: 60 },
    ];

    const result = findIntersection(matchingData, intervalsData);
    expect(result).toEqual([]);
  });
});

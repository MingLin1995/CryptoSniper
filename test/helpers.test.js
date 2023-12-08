// test/helpers.test.js

const {
  formatVolume,
  sortResultsByVolume,
  extractFilterConditions,
} = require("../public/js/helpers");

//單位換算測試
describe("formatVolume function", () => {
  it("成交量大於一億", () => {
    expect(formatVolume(100000000)).toBe("1.00億");
    expect(formatVolume(250000000)).toBe("2.50億");
  });

  it("成交量一億到一萬之間", () => {
    expect(formatVolume(10000)).toBe("1.00萬");
    expect(formatVolume(50000)).toBe("5.00萬");
  });

  it("成交量小於一萬", () => {
    expect(formatVolume(500)).toBe(500);
    expect(formatVolume(9999)).toBe(9999);
  });
});

//排序測試
describe("sortResultsByVolume function", () => {
  it("升冪排列", () => {
    const results = [
      { quote_volume: 500 },
      { quote_volume: 100 },
      { quote_volume: 200 },
    ];
    const sorted = sortResultsByVolume(results, true);
    expect(sorted).toEqual([
      { quote_volume: 100 },
      { quote_volume: 200 },
      { quote_volume: 500 },
    ]);
  });

  it("降冪排列", () => {
    const results = [
      { quote_volume: 500 },
      { quote_volume: 100 },
      { quote_volume: 200 },
    ];
    const sorted = sortResultsByVolume(results, false);
    expect(sorted).toEqual([
      { quote_volume: 500 },
      { quote_volume: 200 },
      { quote_volume: 100 },
    ]);
  });
});

//取得篩選條件測試
describe("extractFilterConditions", () => {
  it("正常篩選數據取得", () => {
    document.body.innerHTML = `
      <input id="time-interval-1" value="15m" />
      <input id="MA1-1" value="25" />
      <input id="MA1-2" value="60" />
      <input id="MA1-3" value="80" />
      <input id="MA1-4" value="99" />
      <input id="comparison-operator-1-1" value="<" />
      <input id="comparison-operator-1-2" value=">" />
      <input id="logical-operator-1" value="and" />

      <input id="time-interval-2" value="1h" />
      <input id="MA2-1" value="25" />
      <input id="MA2-2" value="60" />
      <input id="MA2-3" value="80" />
      <input id="MA2-4" value="99" />
      <input id="comparison-operator-2-1" value="<" />
      <input id="comparison-operator-2-2" value=">" />
      <input id="logical-operator-2" value="and" />

      <input id="time-interval-3" value="4h" />
      <input id="MA3-1" value="25" />
      <input id="MA3-2" value="60" />
      <input id="MA3-3" value="80" />
      <input id="MA3-4" value="99" />
      <input id="comparison-operator-3-1" value="<" />
      <input id="comparison-operator-3-2" value=">" />
      <input id="logical-operator-3" value="and" />

      <input id="time-interval-4" value="1d" />
      <input id="MA4-1" value="25" />
      <input id="MA4-2" value="60" />
      <input id="MA4-3" value="80" />
      <input id="MA4-4" value="99" />
      <input id="comparison-operator-4-1" value="<" />
      <input id="comparison-operator-4-2" value=">" />
      <input id="logical-operator-4" value="and" />
    `;

    const result = extractFilterConditions();
    const expected = [
      {
        time_interval: "15m",
        param_1: 25,
        param_2: 60,
        param_3: 80,
        param_4: 99,
        comparison_operator_1: "<",
        comparison_operator_2: ">",
        logical_operator: "and",
      },
      {
        time_interval: "1h",
        param_1: 25,
        param_2: 60,
        param_3: 80,
        param_4: 99,
        comparison_operator_1: "<",
        comparison_operator_2: ">",
        logical_operator: "and",
      },
      {
        time_interval: "4h",
        param_1: 25,
        param_2: 60,
        param_3: 80,
        param_4: 99,
        comparison_operator_1: "<",
        comparison_operator_2: ">",
        logical_operator: "and",
      },
      {
        time_interval: "1d",
        param_1: 25,
        param_2: 60,
        param_3: 80,
        param_4: 99,
        comparison_operator_1: "<",
        comparison_operator_2: ">",
        logical_operator: "and",
      },
    ];
    expect(result).toEqual(expected);
  });

  it("篩選條件>240MA時", () => {
    window.alert = jest.fn();
    HTMLInputElement.prototype.focus = jest.fn();

    document.body.innerHTML = `
      <input id="time-interval-1" value="15m" />
      <input id="MA1-1" value="25" />
      <input id="MA1-2" value="60" />
      <input id="MA1-3" value="80" />
      <input id="MA1-4" value="250" />
      <input id="comparison-operator-1-1" value="<" />
      <input id="comparison-operator-1-2" value=">" />
      <input id="logical-operator-1" value="and" />

      <input id="time-interval-2" value="1h" />
      <input id="MA2-1" value="25" />
      <input id="MA2-2" value="60" />
      <input id="MA2-3" value="80" />
      <input id="MA2-4" value="99" />
      <input id="comparison-operator-2-1" value="<" />
      <input id="comparison-operator-2-2" value=">" />
      <input id="logical-operator-2" value="and" />

      <input id="time-interval-3" value="4h" />
      <input id="MA3-1" value="25" />
      <input id="MA3-2" value="60" />
      <input id="MA3-3" value="80" />
      <input id="MA3-4" value="99" />
      <input id="comparison-operator-3-1" value="<" />
      <input id="comparison-operator-3-2" value=">" />
      <input id="logical-operator-3" value="and" />

      <input id="time-interval-4" value="1d" />
      <input id="MA4-1" value="25" />
      <input id="MA4-2" value="60" />
      <input id="MA4-3" value="80" />
      <input id="MA4-4" value="99" />
      <input id="comparison-operator-4-1" value="<" />
      <input id="comparison-operator-4-2" value=">" />
      <input id="logical-operator-4" value="and" />
    `;
    const result = extractFilterConditions();
    const expected = [
      {
        time_interval: "15m",
        param_1: 25,
        param_2: 60,
        param_3: 80,
        param_4: 240,
        comparison_operator_1: "<",
        comparison_operator_2: ">",
        logical_operator: "and",
      },
      {
        time_interval: "1h",
        param_1: 25,
        param_2: 60,
        param_3: 80,
        param_4: 99,
        comparison_operator_1: "<",
        comparison_operator_2: ">",
        logical_operator: "and",
      },
      {
        time_interval: "4h",
        param_1: 25,
        param_2: 60,
        param_3: 80,
        param_4: 99,
        comparison_operator_1: "<",
        comparison_operator_2: ">",
        logical_operator: "and",
      },
      {
        time_interval: "1d",
        param_1: 25,
        param_2: 60,
        param_3: 80,
        param_4: 99,
        comparison_operator_1: "<",
        comparison_operator_2: ">",
        logical_operator: "and",
      },
    ];
    expect(window.alert).toHaveBeenCalledWith("請輸入正整數，最多支援到240MA");
    expect(result).toBeNull();
  });
});

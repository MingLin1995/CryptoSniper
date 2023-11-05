// services/priceTracker.js

const WebSocket = require("ws");
const Tracking = require("../models/Tracking");
const { sendNotification } = require("./notificationService");

// 儲存正在執行的 WebSocket 連接
const activeWebSockets = new Map();

const trackPrices = async () => {
  const trackings = await Tracking.find({});

  trackings.forEach((tracking) => {
    const { _id, targetSymbol, targetPrice, telegramId } = tracking;
    const url = `wss://fstream.binance.com/ws/${targetSymbol.toLowerCase()}@trade`;

    // 檢查是否已有執行中的 WebSocket 連接
    if (activeWebSockets.has(_id.toString())) {
      return;
    }

    const ws = new WebSocket(url);
    activeWebSockets.set(_id.toString(), ws); // 將 WebSocket 連接儲存到 Map 中
    let initialPrice = null;
    let lastNotificationTime = 0; // 初始化上次通知時間

    ws.on("message", async function incoming(message) {
      const { p: currentPriceStr } = JSON.parse(message);
      const currentPrice = parseFloat(currentPriceStr);
      const now = Date.now();
      const debounceTime = 5000; // 通知間隔設為 5 秒

      if (initialPrice === null) {
        initialPrice = currentPrice;
      }

      // 檢查是否滿足發送通知的條件
      const conditionMet =
        (initialPrice < targetPrice && currentPrice >= targetPrice) ||
        (initialPrice > targetPrice && currentPrice <= targetPrice);

      // 避免重複發送通知，並考慮 debounce 時間
      if (conditionMet && now - lastNotificationTime > debounceTime) {
        const comparison = initialPrice < targetPrice ? "大於" : "小於";
        await sendNotification(
          telegramId,
          `${targetSymbol.toUpperCase()} 價格 ${comparison} 目標價：${currentPrice}`
        );
        lastNotificationTime = now; // 更新上次通知時間
        await Tracking.deleteOne({ _id });
        //console.log("已移除追踪：", tracking);
        ws.close(); // 關閉 WebSocket 連接
      }
    });

    ws.on("close", () => {
      //console.log("WebSocket 關閉");
      activeWebSockets.delete(_id.toString()); // 移除已關閉的 WebSocket 連接
    });
  });
};

module.exports = { trackPrices };

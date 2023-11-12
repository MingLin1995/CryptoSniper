// services/priceAlertService.js

const WebSocket = require("ws");
const PriceAlert = require("../models/PriceAlert");
const sendNotification = require("./notificationService");

// 儲存正在執行的 WebSocket 連接
const activeWebSockets = new Map();

const trackPrices = async () => {
  const alerts = await PriceAlert.find({}).populate("user");

  if (alerts.length === 0) {
    //console.log("沒有找到任何目標價格的設定。");
    return;
  }
  alerts.forEach((alert) => {
    const {
      _id,
      symbol,
      targetPrice,
      notificationMethod,
      telegramId,
      user,
      lineAccessToken,
    } = alert;

    // 檢查是否已有執行中的 WebSocket 連接
    if (activeWebSockets.has(_id.toString())) {
      return;
    }

    const ws = new WebSocket(
      `wss://fstream.binance.com/ws/${symbol.toLowerCase()}@trade`
    );
    activeWebSockets.set(_id.toString(), ws); // 將 WebSocket 連接儲存到 Map 中

    ws.on("open", function open() {
      //console.log(`WebSocket連線開啟: ${symbol}`);
    });

    let initialPrice = null; //設定當下價格
    let lastNotificationTime = 0; // 初始化上次通知時間
    let hasNotified = false; // 新增一個標記是否已經發送通知的變數

    ws.on("message", async function incoming(message) {
      const data = JSON.parse(message);
      const currentPrice = parseFloat(data.p);
      const now = Date.now();
      const debounceTime = 5000; // 通知間隔設為 5 秒

      if (initialPrice === null) {
        initialPrice = currentPrice;
      }

      // 根據目標價格和當前價格設定不同的通知條件
      if (
        (initialPrice > targetPrice && currentPrice <= targetPrice) ||
        (initialPrice < targetPrice && currentPrice >= targetPrice)
      ) {
        // 獲取當前時間
        const now = Date.now();

        // 判斷是否已經通知過，以及是否已經超過防抖時間
        if (!hasNotified && now - lastNotificationTime > debounceTime) {
          // 發送通知
          sendNotification(
            symbol,
            targetPrice,
            notificationMethod,
            telegramId,
            user,
            lineAccessToken
          );
          hasNotified = true; // 更新已發送通知的狀態
          lastNotificationTime = now; // 更新發送通知的時間戳

          //console.log(`${symbol} 達到目標價格 ${currentPrice}`);
          await PriceAlert.deleteOne({ _id });
          ws.close(); // 關閉 WebSocket 連接
        }
      }
    });

    ws.on("close", () => {
      activeWebSockets.delete(_id.toString());
    });
  });
};

module.exports = { trackPrices };

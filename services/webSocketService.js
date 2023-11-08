// services/webSocketService.js
const WebSocket = require("ws");
const pushNotification = require("./pushService");
const TargetPrice = require("../models/TargetPrice");

async function initializeWebSocket() {
  try {
    const targets = await TargetPrice.find({}).populate("user");

    if (targets.length === 0) {
      console.log("沒有找到任何目標價格的設定。");
      return;
    }

    targets.forEach((target) => {
      const { symbol, targetPrice, user } = target;
      console.log("設定WebSocket追蹤:", symbol, targetPrice, user._id);

      const url = `wss://fstream.binance.com/ws/${symbol.toLowerCase()}@trade`;
      const ws = new WebSocket(url);

      ws.on("open", function open() {
        console.log(`WebSocket連線開啟: ${symbol}`);
      });

      let initialPrice = null;
      let hasNotified = false; // 新增一個標記是否已經發送通知的變數
      let lastNotificationTime = 0; // 上次通知的時間戳
      const debounceTime = 5000; // 設置防抖時間為 5 秒

      ws.on("message", async function incoming(message) {
        const data = JSON.parse(message);
        const currentPrice = parseFloat(data.p);
        //console.log(`目標價: ${targetPrice}, 當前價: ${currentPrice}`);

        if (initialPrice === null) {
          initialPrice = currentPrice;
        }
        //console.log(initialPrice, targetPrice, currentPrice);
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
            pushNotification(user._id, symbol, currentPrice);
            hasNotified = true; // 更新已發送通知的狀態
            lastNotificationTime = now; // 更新發送通知的時間戳

            console.log(`${symbol} 達到目標價格 ${currentPrice}`);
            ws.close(); // 達到目標價格，關閉連線

            // 刪除達到目標價格的記錄
            await TargetPrice.deleteOne({ _id: target._id });
            console.log(`目標價格達成並刪除: ${symbol} @ ${targetPrice}`);
          }
        }
      });

      ws.on("error", (error) => {
        console.error("WebSocket錯誤:", error);
      });

      ws.on("close", () => {
        console.log(`WebSocket連線關閉: ${symbol}`);
      });
    });
  } catch (err) {
    console.error("獲取目標價格失敗:", err);
  }
}

module.exports = initializeWebSocket;

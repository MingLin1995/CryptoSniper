const WebSocket = require("ws");
const notifier = require("node-notifier");

const url = "wss://fstream.binance.com/ws/btcusdt@trade";
const targetPrice = 34140;

const ws = new WebSocket(url);
let notificationSent = false; // 新增的標誌
let initialPrice = null;

ws.on("open", function open() {
  console.log("WebSocket connection opened.");
});

ws.on("message", function incoming(message) {
  //console.log("Received message:");
  const data = JSON.parse(message);
  //console.log(data);

  const currentPrice = parseFloat(data.p);

  // 記錄初始價格
  if (initialPrice === null) {
    initialPrice = currentPrice;
  }

  // 避免重複發送通知
  if (!notificationSent) {
    // 如果初始價格小於目標價格，當當前價格大於等於目標價格時發送通知
    if (initialPrice < targetPrice && currentPrice >= targetPrice) {
      sendNotification(`BTC price 大於 target: ${currentPrice}`);
      notificationSent = true;
    }
    // 如果初始價格大於目標價格，當當前價格小於等於目標價格時發送通知
    else if (initialPrice > targetPrice && currentPrice <= targetPrice) {
      sendNotification(`BTC price 小於 target: ${currentPrice}`);
      notificationSent = true;
    }
  }
});

ws.on("error", (error) => {
  console.error("WebSocket error:", error);
});

ws.on("close", () => {
  console.log("WebSocket connection closed.");
});

function sendNotification(currentPrice) {
  notifier.notify(
    {
      title: "BTC Price Alert",
      message: `BTC price is below target: ${currentPrice}`,
    },
    function (err, response) {
      if (err) {
        console.error("Notification error:", err);
        return;
      }
      console.log("Notification sent:", response);
    }
  );
}

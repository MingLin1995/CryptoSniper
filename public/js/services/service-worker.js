// public/js/services/service-worker.js

self.addEventListener("install", (event) => {
  //console.log("Service worker 安裝成功");
});

self.addEventListener("activate", (event) => {
  //console.log("Service worker 啟動成功");
});

self.addEventListener("push", function (event) {
  //console.log("Received push event:", event);
  try {
    if (event.data) {
      const data = event.data.json();
      // console.log("Push data:", data);
      event.waitUntil(
        self.registration.showNotification(data.title, {
          body: data.body,
          icon: "/images/notification.png",
          tag: "notification-tag",
        })
      );
    } else {
      console.log("推送的数据载荷为空");
    }
  } catch (e) {
    console.error("Error parsing push event data:", e);
  }
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close(); // 關閉通知
  // 導向到特定網址
  event.waitUntil(clients.openWindow("https://crypto-sniper.minglin.vip/"));
});

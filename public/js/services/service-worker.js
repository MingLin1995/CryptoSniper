// public/js/services/service-worker.js

self.addEventListener("install", (event) => {});

self.addEventListener("activate", (event) => {});

self.addEventListener("push", function (event) {
  try {
    if (event.data) {
      const data = event.data.json();
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

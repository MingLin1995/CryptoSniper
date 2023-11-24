// controllers/trackingController.js

const PriceAlert = require("../models/priceAlertSchema.js");
const {
  trackPrices,
  activeWebSockets,
} = require("../services/priceAlertService.js");

const TelegramSubscription = require("../models/telegramSubscriptionSchema");
const LineSubscription = require("../models/lineSubscriptionSchema");
const WebSubscription = require("../models/webSubscriptionSchema");

//建立通知
const addTracking = async (req, res) => {
  const { symbol, targetPrice, notificationMethod, telegramId } = req.body;
  const userId = req.user._id;

  if (!symbol || !targetPrice || !notificationMethod) {
    return res.status(400).json({ error: "缺少必要的參數" });
  }

  try {
    let alertData = {
      userId,
      symbol,
      targetPrice,
      notificationMethod,
    };

    if (notificationMethod === "Telegram") {
      const telegramSubscription = await TelegramSubscription.findOne({
        userId,
      });
      if (telegramSubscription && telegramSubscription.notificationsEnabled) {
        alertData.telegramId = telegramSubscription.telegramId;
      } else {
        throw new Error("用戶停用 Telegram 通知");
      }
    } else if (notificationMethod === "Line") {
      const lineSubscription = await LineSubscription.findOne({ userId });
      if (lineSubscription && lineSubscription.accessToken) {
        alertData.lineAccessToken = lineSubscription.accessToken;
      } else {
        throw new Error("找不到用戶的 Line Access Token");
      }
    } else if (notificationMethod === "Web") {
      const webSubscription = await WebSubscription.findOne({ userId });
      if (webSubscription && webSubscription.enabled) {
        alertData.webSubscription = webSubscription;
      } else {
        throw new Error("Web 通知未啟用");
      }
    }

    const priceAlert = new PriceAlert(alertData);
    await priceAlert.save();
    // 如果追蹤成功保存，啟動價格追蹤
    if (priceAlert) {
      trackPrices();
    }

    if (priceAlert) {
      trackPrices();
      return res.status(200).json({ message: "追蹤成功設置！", priceAlert });
    } else {
      return res.status(404).json({ error: "無法設置追蹤" });
    }
  } catch (error) {
    res.status(500).json({ error: "伺服器錯誤", details: error.message });
  }
};

//取得通知項目
const getNotificationsByMethod = async (req, res) => {
  const { notificationMethod } = req.query;

  try {
    const notifications = await PriceAlert.find({
      userId: req.user._id,
      notificationMethod,
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "無法獲取通知", details: error.message });
  }
};

//刪除通知項目
const deleteNotification = async (req, res) => {
  const { id } = req.query; // 從查詢參數中獲取通知的 ID
  try {
    const notification = await PriceAlert.findById(id);
    if (!notification) {
      return res.status(404).send({ message: "沒有任何通知" });
    }
    if (notification.userId.toString() !== req.user._id.toString()) {
      return res.status(403).send({ message: "無權刪除此通知" });
    }

    // 關閉對應的 websocket
    if (activeWebSockets.has(id)) {
      const ws = activeWebSockets.get(id);
      ws.close();
      activeWebSockets.delete(id);
    }

    await PriceAlert.deleteOne({ _id: id });
    res.status(200).send({ message: "刪除成功" });
  } catch (error) {
    res.status(500).json({ message: "刪除失敗", details: error.message });
  }
};

module.exports = { addTracking, getNotificationsByMethod, deleteNotification };

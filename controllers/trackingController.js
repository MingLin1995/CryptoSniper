// controllers/trackingController.js

const PriceAlert = require("../models/PriceAlert");
const {
  trackPrices,
  activeWebSockets,
} = require("../services/priceAlertService.js");
const User = require("../models/User");

//建立通知
const addTracking = async (req, res) => {
  const { symbol, targetPrice, notificationMethod, telegramId } = req.body;
  const userId = req.user._id;
  try {
    let alertData = {
      user: userId,
      symbol,
      targetPrice,
      notificationMethod,
    };

    if (notificationMethod === "Telegram") {
      const user = await User.findById(userId);
      if (
        user &&
        user.telegramSubscription &&
        user.telegramSubscription.notificationsEnabled
      ) {
        alertData.telegramId = user.telegramSubscription.telegramId;
      } else {
        throw new Error("用戶停用通知");
      }
    }

    if (notificationMethod === "Line") {
      const user = await User.findById(userId);
      if (user && user.lineSubscription && user.lineSubscription.accessToken) {
        alertData.lineAccessToken = user.lineSubscription.accessToken;
      } else {
        throw new Error("找不到用戶的 Line Access Token");
      }
    }

    const priceAlert = new PriceAlert(alertData);
    await priceAlert.save();
    // 如果追蹤成功保存，啟動價格追蹤
    if (priceAlert) {
      trackPrices();
    }

    res.status(201).json({ message: "追蹤成功設置！", priceAlert });
  } catch (error) {
    res.status(400).json({ error: "無法設置追蹤", details: error.message });
  }
};

//取得通知項目
const getNotificationsByMethod = async (req, res) => {
  const { notificationMethod } = req.body; // 從請求的body中獲取通知方法

  try {
    const notifications = await PriceAlert.find({
      user: req.user._id,
      notificationMethod,
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "無法獲取通知", details: error.message });
  }
};

//刪除通知項目
const deleteNotification = async (req, res) => {
  const { id } = req.body;
  try {
    const notification = await PriceAlert.findById(id);
    if (!notification) {
      return res.status(404).send({ message: "沒有任何通知" });
    }
    if (notification.user.toString() !== req.user._id.toString()) {
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

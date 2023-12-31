// controllers/favoriteController.js

const Favorite = require("../models/favoriteSchema");

// 加入追蹤清單
const favoriteAdd = async (req, res) => {
  const { userId, symbol } = req.body;

  if (!userId || !symbol) {
    return res.status(400).send({ message: "缺少必要的參數" });
  }

  try {
    const favorite = await Favorite.findOneAndUpdate(
      { userId },
      { $addToSet: { symbol: symbol } },
      { new: true, upsert: true }
    );
    res.status(200).send({ message: "追蹤成功", favorite });
  } catch (error) {
    res.status(500).send({ message: "追蹤失敗", error: error.message });
  }
};

// 移除追蹤清單
const favoriteRemove = async (req, res) => {
  const { userId, symbol } = req.query;

  if (!userId || !symbol) {
    return res.status(400).send({ message: "缺少必要的查詢參數" });
  }

  try {
    const favorite = await Favorite.findOneAndUpdate(
      { userId },
      { $pull: { symbol: symbol } },
      { new: true }
    );
    if (!favorite) {
      return res.status(404).send({ message: "用戶未設置追蹤清單" });
    }
    res.status(200).send({ message: "移除成功", favorite });
  } catch (error) {
    res.status(500).send({ message: "移除失敗", error: error.message });
  }
};

//查詢追蹤清單
const favoriteList = async (req, res) => {
  const userId = req.user._id;

  try {
    const favorite = await Favorite.findOne({ userId });
    if (!favorite) {
      return res.status(404).send({ message: "用戶未設置追蹤清單" });
    }
    res.status(200).send({ favorites: favorite.symbol });
  } catch (error) {
    res.status(500).send({ message: "查詢失敗", error: error.message });
  }
};

//更新順序清單
const updateOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const newOrder = req.body.order;

    if (!Array.isArray(newOrder)) {
      return res.status(400).send("是否有參數");
    }

    const result = await Favorite.updateOrder(userId, newOrder);

    if (!result) {
      return res.status(404).send("找不到追蹤清單");
    }
    res.status(200).send("追蹤清單更新成功");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  favoriteAdd,
  favoriteRemove,
  favoriteList,
  updateOrder,
};

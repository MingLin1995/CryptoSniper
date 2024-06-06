// controllers/favoriteController.js

const Favorite = require("../models/favoriteSchema");

// 加入追蹤清單
const favoriteAdd = async (req, res) => {
  const { userId, symbol } = req.body;

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

  try {
    const favorite = await Favorite.findOneAndUpdate(
      { userId },
      { $pull: { symbol: symbol } },
      { new: true }
    );

    res.status(200).send({ message: "移除成功", favorite });
  } catch (error) {
    res.status(500).send({ message: "移除失敗", error: error.message });
  }
};

// 查詢追蹤清單，如果不存在則創建空的追蹤清單
const favoriteList = async (req, res) => {
  const userId = req.user._id;

  try {
    const favorite = await Favorite.findOneAndUpdate(
      { userId },
      { $setOnInsert: { symbol: [] } }, // 初始化 symbol 為空陣列
      { new: true, upsert: true, returnNewDocument: true }
    );
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

    await Favorite.updateOrder(userId, newOrder);

    res.status(200).json({ success: true, message: "追蹤清單更新成功" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  favoriteAdd,
  favoriteRemove,
  favoriteList,
  updateOrder,
};

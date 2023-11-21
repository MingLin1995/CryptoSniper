// controllers/favoriteController.js

const User = require("../models/User");

// 加入追蹤清單
const favoriteAdd = async (req, res) => {
  const { userId, symbol } = req.body;

  try {
    await User.updateOne(
      { _id: userId },
      { $addToSet: { favorites: symbol } } // 使用 $addToSet 避免重複
    );
    res.status(200).send({ message: "追蹤成功" });
  } catch (error) {
    res.status(500).send({ message: "追蹤失敗", error: error.message });
  }
};

// 移除追蹤清單
const favoriteRemove = async (req, res) => {
  const userId = req.user._id; // 可能直接從認證信息中獲取 userID
  const { symbol } = req.query; // 從查詢參數中獲取 symbol

  try {
    // 从用户的 favorites 数组移除指定的标的
    await User.updateOne(
      { _id: userId },
      { $pull: { favorites: symbol } } // 使用 $pull 来移除
    );
    res.status(200).send({ message: "最爱标的已移除" });
  } catch (error) {
    res.status(500).send({ message: "移除追蹤失敗", error: error.message });
  }
};

//查詢追蹤清單
const favoriteList = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "用户未找到" });
    }

    res.status(200).send({ favorites: user.favorites });
  } catch (error) {
    res.status(500).send({ message: "查詢失敗", error: error.message });
  }
};

module.exports = {
  favoriteAdd,
  favoriteRemove,
  favoriteList,
};

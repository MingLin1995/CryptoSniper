// CryptSniper/controllers/strategyController.js

const User = require("../models/User");

// 儲存策略
const saveStrategy = async (req, res) => {
  const userId = req.user._id;
  const strategy = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { strategies: strategy } },
      { new: true, runValidators: true }
    );

    // 檢查是否成功更新
    if (!updatedUser) {
      return res.status(404).send({ success: false, message: "用戶未找到" });
    }

    res.send({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "內部伺服器錯誤" });
  }
};

// 取得策略
const getStrategies = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId).select("strategies");
    if (!user) {
      return res.status(404).send({ success: false, message: "用戶未找到" });
    }

    res.send({ success: true, strategies: user.strategies });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "內部伺服器錯誤" });
  }
};

// 删除策略
const deleteStrategy = async (req, res) => {
  const userId = req.user._id;
  const strategyId = req.query.strategyId;
  try {
    await User.findByIdAndUpdate(userId, {
      $pull: { strategies: { _id: strategyId } },
    });

    res.send({ success: true, message: "策略刪除成功" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "內部伺服器錯誤" });
  }
};

module.exports = { saveStrategy, getStrategies, deleteStrategy };

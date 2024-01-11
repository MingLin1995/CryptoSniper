// models/favoriteSchema.js

const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  symbol: [String],
});

// 更新排序的方法
favoriteSchema.statics.updateOrder = async function (userId, newOrder) {
  try {
    const favorite = await this.findOne({ userId: userId });
    if (!favorite) {
      throw new Error("Favorite list not found");
    }
    favorite.symbol = newOrder;
    await favorite.save();
    return favorite;
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.model("Favorite", favoriteSchema);

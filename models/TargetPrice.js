// models/TargetPrice.js
const mongoose = require("mongoose");

const targetPriceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // 与User模型建立关联
      required: true,
    },
    symbol: {
      type: String,
      required: true,
    },
    targetPrice: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const TargetPrice = mongoose.model("TargetPrice", targetPriceSchema);

module.exports = TargetPrice;

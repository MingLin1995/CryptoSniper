// models/priceAlertSchema.js

const mongoose = require("mongoose");

const priceAlertSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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
  notificationMethod: {
    type: String,
    required: true,
    enum: ["Telegram", "Web", "Line"],
  },
});

module.exports = mongoose.model("PriceAlert", priceAlertSchema);

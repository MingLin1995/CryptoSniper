// models/Tracking.js

const mongoose = require("mongoose");

const trackingSchema = new mongoose.Schema({
  targetSymbol: {
    type: String,
    required: true,
  },
  targetPrice: {
    type: Number,
    required: true,
  },
  telegramId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Tracking", trackingSchema);

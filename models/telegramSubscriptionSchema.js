// models/telegramSubscriptionSchema.js

const mongoose = require("mongoose");

const telegramSubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  telegramId: String,
  notificationsEnabled: { type: Boolean, default: true },
});

module.exports = mongoose.model(
  "TelegramSubscription",
  telegramSubscriptionSchema
);

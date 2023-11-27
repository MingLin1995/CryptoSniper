// models/webSubscriptionSchema.js

const mongoose = require("mongoose");

const webSubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  endpoint: String,
  keys: {
    p256dh: String,
    auth: String,
  },
  notificationsEnabled: { type: Boolean, default: true },
});

module.exports = mongoose.model("WebSubscription", webSubscriptionSchema);

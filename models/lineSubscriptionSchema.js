// models/lineSubscriptionSchema.js

const mongoose = require("mongoose");

const lineSubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  accessToken: String,
  notificationsEnabled: { type: Boolean, default: false },
});

module.exports = mongoose.model("LineSubscription", lineSubscriptionSchema);

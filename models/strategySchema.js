// models/strategySchema.js

const mongoose = require("mongoose");

const strategySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: { type: String, required: true },
  conditions: [
    {
      time_interval: { type: String, required: true },
      param_1: { type: Number, required: false },
      param_2: { type: Number, required: false },
      param_3: { type: Number, required: false },
      param_4: { type: Number, required: false },
      comparison_operator_1: { type: String, required: false },
      comparison_operator_2: { type: String, required: false },
      logical_operator: { type: String, required: false },
    },
  ],
});

module.exports = mongoose.model("Strategy", strategySchema);

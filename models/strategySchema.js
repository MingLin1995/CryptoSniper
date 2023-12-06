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
  order: Number,
});

strategySchema.statics.updateOrder = async function (userId, strategiesOrder) {
  try {
    for (const [index, strategyId] of strategiesOrder.entries()) {
      await this.updateOne({ _id: strategyId }, { $set: { order: index } });
    }
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.model("Strategy", strategySchema);

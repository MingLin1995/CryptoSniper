// models/favoriteSchema.js

const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  symbols: [String],
});

module.exports = mongoose.model("Favorite", favoriteSchema);

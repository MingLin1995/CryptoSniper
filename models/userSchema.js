// models/userSchema.js

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  password: { type: String },
  token: { type: String },
  googleId: { type: String, unique: true, sparse: true },
  lineId: { type: String, unique: true, sparse: true },
});

// 密碼加密
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model("User", userSchema);

// models/userSchema.js

const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); //用來密碼加密

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  token: { type: String },
  googleId: { type: String, unique: true, sparse: true },
});

// 在用戶數據被儲存到資料庫之前進行預處理
userSchema.pre("save", async function (next) {
  // 檢查密碼字段是否被修改（例如在創建或更新用戶時）
  if (this.isModified("password")) {
    // 若密碼被修改，則對密碼進行加密操作
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model("User", userSchema);

// models/User.js

const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); //用來密碼加密

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token: { type: String },
  telegramSubscription: {
    telegramId: { type: String },
    notificationsEnabled: { type: Boolean, default: true },
  },
  lineSubscription: {
    accessToken: { type: String },
    notificationsEnabled: { type: Boolean, default: false },
  },
  webSubscription: {
    endpoint: String,
    keys: {
      p256dh: String,
      auth: String,
    },
    enabled: { type: Boolean, default: true },
  },
});

// 在用戶數據被儲存到資料庫之前進行預處理
UserSchema.pre("save", async function (next) {
  // 檢查密碼字段是否被修改（例如在創建或更新用戶時）
  if (this.isModified("password")) {
    // 若密碼被修改，則對密碼進行加密操作
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model("User", UserSchema);

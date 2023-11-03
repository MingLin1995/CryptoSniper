// models/mongoDB.js

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // 連接到MongoDB資料庫，建立CryptoSniper資料庫
    await mongoose.connect("mongodb://localhost:27017/CryptoSniper", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB 成功連接");
  } catch (error) {
    console.error("連接到 MongoDB 時發生錯誤", error);
    //在出現錯誤時，終止應用程式的執行，並返回一個非零的退出碼（1），表示應用程式在連接到 MongoDB 時出現了問題
    process.exit(1);
  }
};

module.exports = connectDB;

// models/mongoDB.js

const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const username = process.env.DB_USERNAME;
    const password = process.env.DB_PASSWORD;
    const dbName = process.env.DB_NAME;
    const host = process.env.DB_HOST;
    const port = process.env.DB_PORT;

    const uri = `mongodb://${username}:${encodeURIComponent(
      password
    )}@${host}:${port}/${dbName}?authSource=admin`;

    await mongoose.connect(uri, {
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

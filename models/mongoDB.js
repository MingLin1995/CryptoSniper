// models/mongoDB.js

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    //建立資料庫
    await mongoose.connect("mongodb://localhost:27017/cryptsniper", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    process.exit(1); // 關閉應用程序
  }
};

module.exports = connectDB;

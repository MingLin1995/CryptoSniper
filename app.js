// app.js

// 引入所需的模組
const express = require("express");
const bodyParser = require("body-parser");
const klinesDataRoutes = require("./routes/klinesDataRoutes");
const volumeDataRoutes = require("./routes/volumeDataRoutes");
const connectDB = require("./models/mongoDB");
const userRoutes = require("./routes/userRoutes");
const trackingRoutes = require("./routes/trackingRoutes");
const trackingController = require("./controllers/trackingController");
const { fetchUpdates } = require("./services/telegramBot");

const app = express();
// Connect to MongoDB
connectDB();

// 使用body-parser中間件來解析POST請求的JSON格式數據
app.use(bodyParser.json());

// 將public資料夾設定為靜態資料夾，讓public資料夾下的文件可以直接通過URL訪問(可直接使用/css/index.css")
app.use(express.static("public"));

// 當用戶訪問網站根目錄('/')時，伺服器返回public目錄下的index.html文件
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// 設定路由
app.use("/api/loadKlinesData", klinesDataRoutes);
app.use("/api/loadVolumeData", volumeDataRoutes);
app.use("/api/users", userRoutes);
app.use("/api/track", trackingRoutes);

// 啟動追踪價格的函數
setInterval(() => trackingController.trackPrices(), 10000); // 每10秒运行一次

app.listen(8000, () => {
  console.log(`
  －－－－－
  Express app listening on port 8000
  －－－－－
  `);
  fetchUpdates();
});

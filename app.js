// app.js
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const screenerRoutes = require("./routes/screenerRoutes");

// 使用body-parser中間件來解析JSON數據
app.use(bodyParser.json());

// 將public設置為靜態資料夾
app.use(express.static("public"));

// 使用res.sendFile來發送HTML文件
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// /api/screener開頭的路由請求，會使用 screenerRoutes 處理相關的操作
app.use("/api", screenerRoutes);

app.listen(8000, () => {
  console.log("Express app listening on port 8000");
});

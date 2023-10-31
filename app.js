// app.js
// 引入所需的模組
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const loadDataRoutes = require("./routes/loadDataRoutes");

// 使用body-parser中間件來解析POST請求的JSON格式數據
app.use(bodyParser.json());

// 將public資料夾設定為靜態資料夾，讓public資料夾下的文件可以直接通過URL訪問(可直接使用/css/index.css")
app.use(express.static("public"));

// 當用戶訪問網站根目錄('/')時，伺服器返回public目錄下的index.html文件
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// 設定路由，所有以/api開頭的請求都會由loadDataRoutes這個路由器來處理
app.use("/api", loadDataRoutes);

app.listen(8000, () => {
  console.log("Express app listening on port 8000");
});

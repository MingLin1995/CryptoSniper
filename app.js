// app.js

const express = require("express");
const bodyParser = require("body-parser");
const klinesDataRoutes = require("./routes/klinesDataRoutes");
const volumeDataRoutes = require("./routes/volumeDataRoutes");
const connectDB = require("./models/mongoDB");
const userRoutes = require("./routes/userRoutes");
const trackingRoutes = require("./routes/trackingRoutes");
const trackingController = require("./controllers/trackingController");
const telegramBotRoutes = require("./routes/telegramBotRoutes");
const updateSymbolData = require("./services/updateSymbolData");

const app = express();
connectDB();

app.use(bodyParser.json());

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.use("/api/loadKlinesData", klinesDataRoutes);
app.use("/api/loadVolumeData", volumeDataRoutes);
app.use("/api/users", userRoutes);
app.use("/api/track", trackingRoutes);
app.use("/telegram-updates", telegramBotRoutes);

// 啟動追踪價格的函數
setInterval(() => trackingController.trackPrices(), 10000); // 每10秒抓一次價格

//updateSymbolData.initialUpdate();

app.listen(8000, () => {
  console.log(`
  －－－－－
  Express app listening on port 8000
  －－－－－
  `);
});

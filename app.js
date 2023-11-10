// app.js

const express = require("express");
const bodyParser = require("body-parser");
const klinesDataRoutes = require("./routes/klinesDataRoutes");
const volumeDataRoutes = require("./routes/volumeDataRoutes");
const connectDB = require("./models/mongoDB");
const userRoutes = require("./routes/userRoutes");
const trackingRoutes = require("./routes/trackingRoutes");
const telegramBotRoutes = require("./routes/telegramBotRoutes");
const updateSymbolData = require("./services/updateSymbolData");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const { trackPrices } = require("./services/priceAlertService.js");

const app = express();
connectDB();

app.use(bodyParser.json());

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.use("/api/loadKlinesData", klinesDataRoutes);
app.use("/api/loadVolumeData", volumeDataRoutes);
app.use("/api/user", userRoutes);
app.use("/api/track", trackingRoutes);
app.use("/api/subscription", subscriptionRoutes);

//webhooks
app.use("/telegram-updates", telegramBotRoutes);

//更新redis資料庫
updateSymbolData.initialUpdate();

//建立webSocket連線
trackPrices();

app.listen(8000, () => {
  console.log(`
  －－－－－
  Express app listening on port 8000
  －－－－－
  `);
});

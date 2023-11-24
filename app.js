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
const lineNotifyRoutes = require("./routes/lineNotifyRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const strategyRoutes = require("./routes/strategyRoutes");
const updateTelegramIdRoutes = require("./routes/updateTelegramIdRoutes");
const webSubscriptionRoutes = require("./routes/webSubscriptionRoutes");

const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerDefinition = require("./swaggerDef");

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
app.use("/api/favorite", favoriteRoutes);
app.use("/api/strategy", strategyRoutes);
app.use("/api/updateTelegramId", updateTelegramIdRoutes);

//建立web通知
app.use("/web-subscription", webSubscriptionRoutes);
//建立Line通知
app.use("/line-notify-callback", lineNotifyRoutes);
//建立TG通知
app.use("/telegram-updates", telegramBotRoutes);

//更新redis資料庫
updateSymbolData.initialUpdate();

//建立webSocket連線
trackPrices();

// Swagger JSDoc setup
const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"], // Path to the API docs
};
const swaggerSpec = swaggerJSDoc(options);

// Setup Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(8000, () => {
  console.log(`
  －－－－－
  Express app listening on port 8000
  －－－－－
  `);
});

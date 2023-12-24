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

// 第三方登入
const passport = require("passport");
const googleAuthRoutes = require("./routes/googleRoutes");
require("./services/googleAuthService");

const lineAuthRoutes = require("./routes/lineRoutes");
require("./services/lineAuthService.js");
const session = require("express-session");

// API 文件
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerDefinition = require("./swaggerDef");

// ---------------------------
require("dotenv").config();

const app = express();
connectDB();

app.use(bodyParser.json());

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.use(passport.initialize());

app.use(
  session({
    secret: process.env.JWT_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  })
);

app.use("/api/loadKlinesData", klinesDataRoutes);
app.use("/api/loadVolumeData", volumeDataRoutes);
app.use("/api/user", userRoutes);
app.use("/api/track", trackingRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/favorite", favoriteRoutes);
app.use("/api/strategy", strategyRoutes);
app.use("/api/updateTelegramId", updateTelegramIdRoutes);

// 到價通知
app.use("/web-subscription", webSubscriptionRoutes);
app.use("/line-notify-callback", lineNotifyRoutes);
app.use("/telegram-updates", telegramBotRoutes);

// 更新redis資料庫
updateSymbolData.initialUpdate();

// 建立webSocket連線
trackPrices();

//第三方登入
app.use("/auth/google", googleAuthRoutes);
app.use("/auth/line", lineAuthRoutes);

// API 文件
const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"],
};
const swaggerSpec = swaggerJSDoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(8000, () => {
  console.log(`
  －－－－－
  Express app listening on port 8000
  －－－－－
  `);
});

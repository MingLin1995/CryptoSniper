// routes/userRoutes.js

const express = require("express");
const userController = require("../controllers/userController");
const verifyToken = require("../auth");

const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", verifyToken, userController.logout);
router.post("/updateTelegramId", verifyToken, userController.updateTelegramId);
router.post("/verifyToken", verifyToken, userController.verifyToken);
router.get("/checkNotification", verifyToken, userController.checkNotification);
router.post(
  "/toggleNotification",
  verifyToken,
  userController.toggleNotification
);
module.exports = router;

// routes/userRoutes.js

const express = require("express");
const userController = require("../controllers/userController");
const verifyToken = require("../auth");

const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.delete("/logout", verifyToken, userController.logout);
router.patch("/updateTelegramId", verifyToken, userController.updateTelegramId);
router.get("/verifyToken", verifyToken, userController.verifyToken);

module.exports = router;

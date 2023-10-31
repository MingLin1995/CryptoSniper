// routes/userRoutes.js

const express = require("express");
const userController = require("../controllers/userController");
const { verifyToken } = require("../auth"); // 修改這裡

const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", verifyToken, userController.logout);

module.exports = router;

// routes/favoriteRoutes.js

const express = require("express");
const favoriteController = require("../controllers/favoriteController");
const verifyToken = require("../auth");

const router = express.Router();

router.post("/add", verifyToken, favoriteController.favoriteAdd);
router.post("/remove", verifyToken, favoriteController.favoriteRemove);
router.get("/list", verifyToken, favoriteController.favoriteList);

module.exports = router;

// routes/favoriteRoutes.js

const express = require("express");
const favoriteController = require("../controllers/favoriteController");
const verifyToken = require("../auth");

const router = express.Router();

router.post("/", verifyToken, favoriteController.favoriteAdd);
router.delete("/", verifyToken, favoriteController.favoriteRemove);
router.get("/", verifyToken, favoriteController.favoriteList);

module.exports = router;

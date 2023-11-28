// routes/lineRoutes.js

const express = require("express");
const passport = require("passport");
const lineAuthController = require("../controllers/lineAuthController");
const router = express.Router();

router.get("/", passport.authenticate("line", { session: false }));

router.get(
  "/callback",
  passport.authenticate("line", { failureRedirect: "/", session: false }),
  lineAuthController.lineAuthCallback
);

module.exports = router;

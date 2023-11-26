// routes/googleRoutes.js

const express = require("express");
const passport = require("passport");
const googleAuthController = require("../controllers/googleAuthController");
const router = express.Router();

router.get(
  "/",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
    session: false,
  }),
  googleAuthController.googleAuthCallback
);

module.exports = router;

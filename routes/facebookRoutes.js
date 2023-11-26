// routes/facebookRoutes.js

const express = require("express");
const passport = require("passport");
const facebookAuthController = require("../controllers/facebookAuthController");
const router = express.Router();

router.get("/", passport.authenticate("facebook"));

router.get(
  "/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/",
    session: false,
  }),
  facebookAuthController.facebookAuthCallback
);

module.exports = router;

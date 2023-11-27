// routes/googleRoutes.js

const express = require("express");
const passport = require("passport");
const googleAuthController = require("../controllers/googleAuthController");
const router = express.Router();
/**
 * @swagger
 * tags:
 *   - name: 第三方登入
 */

/**
 * @swagger
 * /auth/google:
 *   get:
 *     tags: [第三方登入]
 *     summary: 使用 google 帳號登入
 *     description: 允許使用者使用其 google 帳號進行登入。
 *     responses:
 *       200:
 *         description: 成功使用 google 帳號登入
 *       400:
 *         description: 登入請求中的錯誤
 *       401:
 *         description: google 身份驗證失敗
 *       500:
 *         description: 伺服器錯誤
 */

router.get(
  "/",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     tags: [第三方登入]
 *     summary: google 登入回調
 *     description: 處理來自 google 的登入回調。
 *     responses:
 *       302:
 *         description: 根據身份驗證結果進行重定向
 */

router.get(
  "/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
    session: false,
  }),
  googleAuthController.googleAuthCallback
);

module.exports = router;

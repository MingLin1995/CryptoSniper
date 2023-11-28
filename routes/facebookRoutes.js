// routes/facebookRoutes.js

const express = require("express");
const passport = require("passport");
const facebookAuthController = require("../controllers/facebookAuthController");
const router = express.Router();
/**
 * @swagger
 * tags:
 *   - name: 第三方登入
 */

/**
 * @swagger
 * /auth/facebook:
 *   get:
 *     tags: [第三方登入]
 *     summary: 使用 Facebook 帳號登入
 *     description: 允許使用者使用 Facebook 帳號進行登入
 *     responses:
 *       200:
 *         description: 成功使用 Facebook 帳號登入
 *       400:
 *         description: 登入請求中的錯誤
 *       401:
 *         description: Facebook 身份驗證失敗
 *       500:
 *         description: 伺服器錯誤
 */

router.get("/", passport.authenticate("facebook"));

/**
 * @swagger
 * /auth/facebook/callback:
 *   get:
 *     tags: [第三方登入]
 *     summary: facebook 登入回調
 *     description: 處理來自 facebook 的登入回調
 *     responses:
 *       302:
 *         description: 根據身份驗證結果進行重定向
 */

router.get(
  "/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/",
    session: false,
  }),
  facebookAuthController.facebookAuthCallback
);

module.exports = router;

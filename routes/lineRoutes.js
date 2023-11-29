// routes/lineRoutes.js

const express = require("express");
const passport = require("passport");
const lineAuthController = require("../controllers/lineAuthController");
const router = express.Router();
/**
 * @swagger
 * tags:
 *   - name: 第三方登入
 */

/**
 * @swagger
 * /auth/line:
 *   get:
 *     tags: [第三方登入]
 *     summary: 使用 line 帳號登入
 *     description: 允許使用者使用其line 帳號進行登入
 *     responses:
 *       200:
 *         description: 成功使用 line 帳號登入
 *       400:
 *         description: 登入請求中的錯誤
 *       401:
 *         description: line 身份驗證失敗
 *       500:
 *         description: 伺服器錯誤
 */
router.get("/", passport.authenticate("line", { session: false }));
/**
 * @swagger
 * /auth/line/callback:
 *   get:
 *     tags: [第三方登入]
 *     summary: line 登入回調
 *     description: 處理來自 line 的登入回調
 *     responses:
 *       302:
 *         description: 根據身份驗證結果進行重定向
 */
router.get(
  "/callback",
  passport.authenticate("line", { failureRedirect: "/", session: false }),
  lineAuthController.lineAuthCallback
);

module.exports = router;

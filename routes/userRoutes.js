// routes/userRoutes.js

const express = require("express");
const userController = require("../controllers/userController");
const verifyToken = require("../auth");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: 會員
 */

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     tags: [會員]
 *     summary: 註冊會員
 *     description: 使用者提供姓名、電子信箱和密碼來註冊會員
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: 使用者的姓名
 *               email:
 *                 type: string
 *                 format: email
 *                 description: 使用者的電子信箱
 *               password:
 *                 type: string
 *                 format: password
 *                 description: 使用者的密碼
 *     responses:
 *       201:
 *         description: 註冊成功
 *       400:
 *         description: 請求資料不完整或電子信箱已被註冊
 *       500:
 *         description: 伺服器錯誤
 */
router.post("/register", userController.register);

/**
 * @swagger
 * /api/user:
 *   post:
 *     tags: [會員]
 *     summary: 使用者登入
 *     description: 使用者提供電子信箱和密碼進行登入
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: 使用者的電子信箱
 *               password:
 *                 type: string
 *                 format: password
 *                 description: 用戶的密碼
 *     responses:
 *       200:
 *         description: 登入成功，返回 token 和用戶資訊
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 telegramId:
 *                   type: string
 *                 userId:
 *                   type: string
 *       400:
 *         description: 請求資料不完整
 *       401:
 *         description: 電子信箱或密碼錯誤
 *       500:
 *         description: 伺服器錯誤
 */
router.post("/", userController.login);

/**
 * @swagger
 * /api/user:
 *   delete:
 *     tags: [會員]
 *     summary: 用戶登出
 *     description: 清除用戶的 localStorage 和 token 來執行登出操作
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 登出成功
 *       500:
 *         description: 伺服器錯誤
 */
router.delete("/", verifyToken, userController.logout);

/**
 * @swagger
 * /api/user:
 *   get:
 *     tags: [會員]
 *     summary: 驗證登入狀態
 *     description: 檢查提供的 Token 是否有效
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token 驗證成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *       401:
 *         description: 無效的 Token 或 未提供 Token
 *       500:
 *         description: 伺服器錯誤
 */
router.get("/", verifyToken, userController.verifyToken);

module.exports = router;

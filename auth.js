// auth.js

const jwt = require("jsonwebtoken");
const User = require("./models/userSchema");
require("dotenv").config();

const secretKey = process.env.JWT_SECRET_KEY;

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers["authorization"];

    if (!token) {
      return res.status(401).json({ error: "無權訪問" });
    }

    const decoded = jwt.verify(token, secretKey);

    const user = await User.findById(decoded.id);

    if (!user || user.token !== token) {
      return res.status(401).json({ error: "token 不正確" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = verifyToken;

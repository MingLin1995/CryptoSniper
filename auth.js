// auth.js

const jwt = require("jsonwebtoken");
const User = require("./models/User");

exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.headers["authorization"];

    if (!token) {
      return res.status(401).json({ error: "無權訪問" });
    }

    //解碼
    const decoded = jwt.verify(token, "secretkey");

    // 根據解碼的 ID 找用戶
    const user = await User.findById(decoded.id);

    if (!user || user.token !== token) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

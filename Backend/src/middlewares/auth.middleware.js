const config = require("../config/config");
const jwt = require("jsonwebtoken");

async function authAdmin(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    if (decoded.role !== "admin") {
      return res.status(403).json({
        message: "You do not have an access to create a product",
      });
    }
    next();
  });
}

module.exports = {
  authAdmin,
};

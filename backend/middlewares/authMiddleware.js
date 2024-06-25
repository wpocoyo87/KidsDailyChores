const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/constants");
const errorHandler = require("../utils/errorHandler");

const authMiddleware = (req, res, next) => {
  // Get token from header
  const token = req.header("Authorization");

  // Check if not token
  if (!token) {
    return errorHandler(res, 401, "Authorization denied");
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded.user;
    next();
  } catch (err) {
    errorHandler(res, 401, "Token is not valid");
  }
};

module.exports = authMiddleware;

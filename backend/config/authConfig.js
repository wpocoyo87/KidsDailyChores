const jwt = require("jsonwebtoken");

console.log("JWT Secret:", process.env.JWT_SECRET); // Debugging line

const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT secret key is missing");
  }

  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

module.exports = { generateToken };

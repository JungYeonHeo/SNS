const jwt = require("jsonwebtoken");
const response = require("./response");
const dotenv = require("dotenv");
dotenv.config();

const isUser = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!(authHeader && authHeader.startsWith("Bearer"))) {
    return res.status(401).json({message: response.LOGIN_REQUIRED});
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_ACCESS_TOKEN, async (error, user) => {
    if (error) { 
      return res.status(401).json({message: response.LOGIN_REQUIRED});
    }
    req.user = user;
    next();
  });
};

module.exports = isUser;
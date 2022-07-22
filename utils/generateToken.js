const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();

const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_ACCESS_TOKEN, {
    expiresIn: process.env.TOKEN_EXPiRES_IN,
  });
};

module.exports = generateAccessToken;
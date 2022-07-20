const dotenv = require("dotenv");
dotenv.config();

const pool2 = {
  redisInfo: {
    host: process.env.REDIS_URL,
    port: process.env.REDIS_PORT,
    database: process.env.DB_NUM,
    password: process.env.REDIS_PW,
  }
};

module.exports = pool2;

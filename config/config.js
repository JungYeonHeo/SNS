require("dotenv").config();
const env = process.env;

const development = {
  username: env.MYSQL_USER,
  password: env.MYSQL_PASSWORD,
  database: env.MYSQL_DATABASE,
  host: env.MYSQL_HOST,
  dialect: env.DB_TYPE,
  port: env.MYSQL_PORT,
  timezone: "+09:00"
};

const production = {
  username: env.MYSQL_USER,
  password: env.MYSQL_PASSWORD,
  database: env.MYSQL_DATABASE,
  host: env.MYSQL_HOST,
  dialect: env.DB_TYPE,
  port: env.MYSQL_PORT,
  timezone: "+09:00"
};

const test = {
  username: env.MYSQL_USER,
  password: env.MYSQL_PASSWORD,
  database: env.MYSQL_DATABASE,
  host: env.MYSQL_HOST,
  dialect: env.DB_TYPE,
  port: env.MYSQL_PORT,
  timezone: "+09:00"
};

module.exports = { development, production, test };
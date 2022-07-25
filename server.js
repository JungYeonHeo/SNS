const app = require("./app.js");
const logger = require("./utils/winston");
const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  logger.info(`express is running on ${port}`);
});
const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const index = require("./routes/index");
const response = require("./utils/response");

class App {
  constructor() {
    this.app = express();
    this.setMiddleWare();
    this.getRouting();
    this.errorHandler();
  }

  setMiddleWare() {
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.json());
    this.app.use(logger("dev"));
    this.app.use(cors());
  }

  getRouting() {
    this.app.use("/", index);
  }

  errorHandler() {
    this.app.use((req, res, _) => {
      res.status(404).json(response.NOT_FOUND);
    });

    this.app.use((req, res, _) => {
      res.status(500).json(response.INTERNAL_SERVER_ERROR);
    });
  }
}

module.exports = new App().app;
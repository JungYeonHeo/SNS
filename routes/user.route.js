const express = require("express");
const UserController = require("../controllers/user.controller");
const router = express.Router();

router.get("/join");
router.get("/login");

module.exports = router;
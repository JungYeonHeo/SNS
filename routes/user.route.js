const express = require("express");
const UserController = require("../controllers/user.controller");
const { checkJoin, checkLogin } = require("../utils/userValidator");
const router = express.Router();

router.post("/join", checkJoin, UserController.joinUser);
router.post("/login", checkLogin, UserController.loginUser);

module.exports = router;
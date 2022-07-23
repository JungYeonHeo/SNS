const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");
const { checkJoin, checkLogin } = require("../utils/userValidator");
const isUser = require("../utils/validateJwt");

router.post("/join", checkJoin, UserController.joinUser);
router.post("/login", checkLogin, UserController.loginUser);
router.get("/myInfo", isUser, UserController.myInfoUser);

module.exports = router;
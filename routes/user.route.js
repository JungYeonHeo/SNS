const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");
const { checkJoinEmail, checkJoinNum, checkJoin, checkLogin } = require("../utils/userValidator");
const isUser = require("../utils/validateJwt");

router.post("/joinEmailConfirm", checkJoinEmail, UserController.joinEmailConfirmUser);
router.post("/joinRandomNumberConfirm", checkJoinNum, UserController.joinRandomNumberConfirmUser);
router.post("/join", checkJoin, UserController.joinUser);
router.post("/login", checkLogin, UserController.loginUser);
router.get("/loginConfirm", UserController.loginConfirmUser);
router.get("/myInfo", isUser, UserController.myInfoUser);
router.get("/likeList", isUser, UserController.myLikeListUser);

module.exports = router;
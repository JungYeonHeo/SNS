const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");
const { checkEmail, checkJoinNum, checkJoin, checkLogin, checkUpdateMyInfo } = require("../utils/userValidator");
const isUser = require("../utils/validateJwt");

router.post("/joinEmailConfirm", checkEmail, UserController.joinEmailConfirmUser);
router.post("/joinRandomNumberConfirm", checkJoinNum, UserController.joinRandomNumberConfirmUser);
router.post("/join", checkJoin, UserController.joinUser);
router.post("/login", checkLogin, UserController.loginUser);
router.get("/loginConfirm", UserController.loginConfirmUser);
router.post("/findPw", checkEmail, UserController.findPwUser);
router.get("/search", isUser, UserController.searchByUser);
router.post("/follow", isUser, UserController.followUser);
router.get("/myInfo", isUser, UserController.myInfoUser);
router.patch("/update", [isUser, checkUpdateMyInfo], UserController.updateUser);
router.get("/likeList", isUser, UserController.myLikeListUser);

module.exports = router;
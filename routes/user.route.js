const express = require("express");
const UserController = require("../controllers/user.controller");
const router = express.Router();

router.post("/join", UserController.joinUser);
router.post("/login", UserController.loginUser);

module.exports = router;
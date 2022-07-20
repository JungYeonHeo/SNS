const express = require("express");
const AuthController = require("../controllers/auth.controller");
const router = express.Router();

router.get("/join");
router.get("/login");

module.exports = router;
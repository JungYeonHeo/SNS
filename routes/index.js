const express = require("express");
const router = express.Router();

const user = require("./user.route");
const post = require("./post.route");

router.use("/user", user);
router.use("/post", post);

module.exports = router;
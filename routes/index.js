const express = require("express");
const router = express.Router();

const auth = require("./auth.route");
const post = require("./post.route");

router.use("/auth", auth);
router.use("/post", post);

module.exports = router;
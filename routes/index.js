const express = require("express");
const router = express.Router();

const user = require("./user.route");
const post = require("./post.route");

router.use("/user", user);
router.use("/post", post);
router.get("/", (req, res, next) => {
  res.send(`<div style='text-align:center;margin:300px;'>
    <h1>Hello, welcome to SNS!!</h1> 
    <h3>This is a backend service.</h3>
    <h3>Please check the API document on README.</h3> </div>`);
});

module.exports = router;
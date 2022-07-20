const express = require("express");
const router = express.Router();
const PostController = require("../controllers/post.controller");

router.get("/create");
router.get("/update");
router.get("/delete");
router.get("/list");
router.get("/deletedList");
router.get("/detail");
router.put("/restore");

module.exports = router;
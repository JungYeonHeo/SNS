const express = require("express");
const router = express.Router();
const PostController = require("../controllers/post.controller");

router.post("/create", PostController.createPost);
router.patch("/update");
router.patch("/delete");
router.get("/detail");
router.get("/list");
router.patch("/like");
router.get("/deletedList");
router.patch("/restore");

module.exports = router;
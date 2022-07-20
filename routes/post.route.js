const express = require("express");
const router = express.Router();
const PostController = require("../controllers/post.controller");

router.post("/create", PostController.createPost);
router.patch("/update/:id", PostController.updatePost);
router.patch("/delete/:id", PostController.deletePost);
router.get("/detail/:id", PostController.detailPost);
router.get("/list");
router.patch("/like");
router.get("/deletedList");
router.patch("/restore");

module.exports = router;
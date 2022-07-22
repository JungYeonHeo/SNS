const express = require("express");
const router = express.Router();
const PostController = require("../controllers/post.controller");
const isUser = require("../utils/validateJwt");

router.post("/create", isUser, PostController.createPost);
router.patch("/update/:id", isUser, PostController.updatePost);
router.patch("/delete/:id", isUser, PostController.deletePost);
router.get("/detail/:id", isUser, PostController.detailPost);
router.get("/list", isUser, PostController.listPost);
router.patch("/like/:id", isUser, PostController.likePost);
router.get("/deletedList", isUser, PostController.deletedListPost);
router.patch("/restore/:id", isUser, PostController.restorePost);

module.exports = router;
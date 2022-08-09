const express = require("express");
const router = express.Router();
const PostController = require("../controllers/post.controller");
const isUser = require("../utils/validateJwt");
const checkPost = require("../utils/postValidator");
const checkComment = require("../utils/commentValidator");

router.post("/create", [isUser, checkPost], PostController.createPost);
router.patch("/update/:postId", [isUser, checkPost], PostController.updatePost);
router.patch("/delete/:postId", isUser, PostController.deletePost);
router.get("/detail/:postId", isUser, PostController.detailPost);
router.patch("/like/:postId", isUser, PostController.likePost);
router.get("/deletedList", isUser, PostController.deletedListPost);
router.patch("/restore/:postId", isUser, PostController.restorePost);
router.get("/list", isUser, PostController.ListPost);

router.post("/comment/:postId", [isUser, checkComment], PostController.createComment);
router.patch("/comment/:commentId", [isUser, checkComment], PostController.updateComment);
router.delete("/comment/:commentId", isUser, PostController.deleteComment);
router.patch("/comment/like/:commentId", isUser, PostController.likeComment);
// router.get("/comment/:postId", isUser, PostController.listComment);

module.exports = router;
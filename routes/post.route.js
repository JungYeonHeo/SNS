const express = require("express");
const router = express.Router();
const PostController = require("../controllers/post.controller");
const isUser = require("../utils/validateJwt");
const checkPost = require("../utils/postValidator");

router.post("/create", [isUser, checkPost], PostController.createPost);
router.patch("/update/:id", [isUser, checkPost], PostController.updatePost);
router.patch("/delete/:id", isUser, PostController.deletePost);
router.get("/detail/:id", isUser, PostController.detailPost);
router.patch("/like/:id", isUser, PostController.likePost);
router.get("/deletedList", isUser, PostController.deletedListPost);
router.patch("/restore/:id", isUser, PostController.restorePost);
router.get("/list", isUser, PostController.listPost);

module.exports = router;
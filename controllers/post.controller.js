const PostService = require("../services/post.service");
const response = require("../utils/response");
require("date-utils");

class PostController {
  static async createPost(req, res) {
    const userId = req.user.id;
    const { title, content, hashtags } = req.body;
    try {
      await PostService.create(userId, title, content, hashtags);
      res.status(200).json(response.CREATE);
    } catch (err) {
      console.log(err);
      res.status(500).json(response.INTERNAL_SERVER_ERROR);
    }
  }

  static async updatePost(req, res) {
    const userId = req.user.id;
    const { postId, title, content, hashtags } = req.body;
    try {
      const writer = await PostService.getPostWriter(postId);
      if (userId != writer) {
        res.status(400).json(response.BAD_REQUEST);
      }

      const updatedAt = new Date().toFormat("YYYY-MM-DD HH:MI:SS");
      await PostService.update(postId, title, content, hashtags, updatedAt);
      res.status(200).json(response.UPDATE);
    } catch (err) {
      console.log(err);
      res.status(500).json(response.INTERNAL_SERVER_ERROR);
    }
  }
}

module.exports = PostController;
const PostService = require("../services/post.service");
const response = require("../utils/response");

class PostController {
  static async createPost(req, res) {
    const { title, content, hashtags } = req.body;
    try {
      await PostService.create(title, content, hashtags);
      res.status(200).json(response.CREATE);
    } catch (err) {
      console.log(err);
      res.status(500).json(response.INTERNAL_SERVER_ERROR);
    }
  }
}

module.exports = PostController;
const models = require("../models");
const { Op } = require("sequelize")

class PostService {
  static async create(title, content, hashtags) {
    const userId = "qwer1234@naver.com";
    try {
      const getCreatePost = await models.posts.create({ userId: userId, title: title, content: content });
      const postId = getCreatePost.getDataValue("id");
      if (postId) {
        const hashtagArr = hashtags.split(",");
        for (const tag of hashtagArr) {
          await models.hashtags.create({ postId: postId, tag: tag });
        }
      }
    } catch (err) {
      throw err;
    }
  }
}

module.exports = PostService;
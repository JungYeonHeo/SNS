const models = require("../models");
const { Op } = require("sequelize")

class PostService {
  static async create(userId, title, content, hashtags) {
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

  static async getPostWriter(postId) {
    try {
      const writer = await models.posts.findOne({ attributes: ["userId"], }, { where: {id: postId} });
      return writer.getDataValue("userId");
    } catch (err) {
      throw err;
    }
  }

  static async update(postId, title, content, hashtags, updatedAt) {
    try {
      await models.posts.update({ title: title, content: content, updatedAt: updatedAt }, { where: {id: postId} });
      await models.hashtags.destroy({ where: {postId: postId} });
      const hashtagArr = hashtags.split(",");
      for (const tag of hashtagArr) {
        await models.hashtags.create({ postId: postId, tag: tag });
      }
    } catch (err) {
      throw err;
    }
  }

  static async delete(postId) {
    try {
      await models.posts.update({ state: 1 }, { where: {id: postId} });
    } catch (err) {
      throw err;
    }
  }
}

module.exports = PostService;
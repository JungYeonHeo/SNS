const models = require("../models");
const { Op } = require("sequelize")

class PostService {
  static async create(userId, title, content, hashtags) {
    try {
      const getCreatePost = await models.posts.create({ userId: userId, title: title, content: content });
      const postId = getCreatePost.getDataValue("id");
      if (postId && hashtags != "") { // 해시태그를 입력하지 않았을 때 빈값이 들어가는 것을 방지
        const hashtagArr = hashtags.split(",");
        for (const tag of hashtagArr) {
          await models.hashtags.create({ postId: postId, tag: tag });
        }
      }
    } catch (err) {
      throw err;
    }
  }

  static async getWriter(postId) {
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
  
  static async setAddViews(postId) {
    try {
      await models.posts.increment({ views: 1 }, { where: {id: postId} });
    } catch (err) {
      throw err;
    }
  }

  static async getDetail(postId) {
    try {
      const detailInfo = await models.posts.findOne({ include: [{
        model: models.hashtags,
        attributes: [[models.sequelize.fn("group_concat", models.sequelize.col("tag")), "hashtags"]],
        required: false // 해시태그 없으면 값이 안나오는 것을 방지하기 위해 Left Outer Join 사용
      }],
      attributes: ["id", "userId", "title", "content", "likes", "views",
      [models.sequelize.fn("date_format", models.sequelize.col("createdAt"), "%Y-%m-%d %h:%i:%s"), "createdAt"],
      [models.sequelize.fn("date_format", models.sequelize.col("updatedAt"), "%Y-%m-%d %h:%i:%s"), "updatedAt"]],
      where: { id: postId }, group: "posts.id", raw: true, });
      return detailInfo;
    } catch (err) {
      throw err;
    }
  }

  static async getClickedLikePost(postId, userId) {
    try {
      const isClickedLikePost = await models.postLikes.findOne({ where: {[Op.and]: [{ postId: postId}, { userId: userId }]} });
      if (isClickedLikePost == null) {
        return false;
      } return true;
    } catch (err) {
      throw err;
    }
  }
  
  static async setAddLikes(postId) {
    try {
      await models.posts.increment({ likes: 1 }, { where: {id: postId} });
    } catch (err) {
      throw err;
    }
  }

  static async setAddLikeUser(postId, userId) {
    try {
      await models.postLikes.create({ postId: postId, userId: userId });
    } catch (err) {
      throw err;
    }
  }

  static async setMinusLikes(postId) {
    try {
      await models.posts.increment({ likes: -1 }, { where: {id: postId} });
    } catch (err) {
      throw err;
    }
  }

  static async setMinusLikeUser(postId, userId) {
    try {
      await models.postLikes.destroy({ where: {[Op.and]: [{ postId: postId }, { userId: userId }]} });
    } catch (err) {
      throw err;
    }
  }

  static async getDeletedList(userId) {
    try {
      const deletedListInfo = await models.posts.findAll({ include: [{
        model: models.hashtags,
        attributes: [[models.sequelize.fn("group_concat", models.sequelize.col("tag")), "hashtags"]],
        required: false // 해시태그 없으면 값이 안나오는 것을 방지하기 위해 Left Outer Join 사용
      }],
      attributes: ["id", "userId", "title", "content", "likes", "views",
      [models.sequelize.fn("date_format", models.sequelize.col("createdAt"), "%Y-%m-%d %h:%i:%s"), "createdAt"],
      [models.sequelize.fn("date_format", models.sequelize.col("updatedAt"), "%Y-%m-%d %h:%i:%s"), "updatedAt"]],
      where: {[Op.and]: [{ state: 1 }, { userId: userId }]}, group: "posts.id", raw: true, });
      if (deletedListInfo == []) {
        return [];
      } return deletedListInfo;
    } catch (err) {
      throw err;
    }
  }

  static async setRestorePost(postId) {
    try {
      await models.posts.update({ state: 0 }, { where: {id: postId} });
    } catch (err) {
      throw err;
    }
  }
}

module.exports = PostService;
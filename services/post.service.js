const models = require("../models");
const { Op } = require("sequelize");
const makeSearchWord = require("../utils/makeSearchWord");

class PostService {
  static async setPost(userId, title, content, hashtags) {
    try {
      const getCreatePost = await models.posts.create({userId: userId, title: title, content: content});
      const postId = getCreatePost.getDataValue("id");
      if (postId && hashtags != "") { // 해시태그를 입력하지 않았을 때 빈값이 들어가는 것을 방지
        const hashtagArr = hashtags.split(",");
        for (const tag of hashtagArr) {
          await models.hashtags.create({postId: postId, tag: tag});
        }
      }
    } catch (err) {
      throw err;
    }
  }

  static async getById(postId) {
    try {
      return await models.posts.findOne({where: {id: postId}});
    } catch (err) {
      throw err;
    }
  }

  static async getWriter(postId) {
    try {
      const writer = await models.posts.findOne({attributes: ["userId"], where: {id: postId}});
      return writer.getDataValue("userId");
    } catch (err) {
      throw err;
    }
  }

  static async setUpdatePost(postId, title, content, hashtags) {
    try {
      await models.posts.update({title: title, content: content}, {where: {id: postId}});
      await models.hashtags.destroy({where: {postId: postId}});
      const hashtagArr = hashtags.split(",");
      for (const tag of hashtagArr) {
        await models.hashtags.create({postId: postId, tag: tag});
      }
    } catch (err) {
      throw err;
    }
  }

  static async setDeletePost(postId) {
    try {
      await models.posts.update({state: 1}, {where: {id: postId}});
    } catch (err) {
      throw err;
    }
  }
  
  static async getPostLog(postId, userId) {
    try {
      return await models.postLogs.findOne({where: {[Op.and]: [{postId: postId}, {userId: userId}]}});
    } catch (err) {
      throw err;
    }
  }

  static async setPostLog(postId, userId) {
    try {
      return await models.postLogs.create({postId: postId, userId: userId});
    } catch (err) {
      throw err;
    }
  }

  static async setAddMyViews(id) {
    // 내가 해당 게시글을 본 횟수 증가
    try {
      await models.postLogs.increment({userViews: 1}, {where: {id: id}});
    } catch (err) {
      throw err;
    }
  }

  static async setAddViews(postId) {
    // 게시글 조회수 증가
    try {
      await models.posts.increment({views: 1}, {where: {id: postId}});
    } catch (err) {
      throw err;
    }
  }

  static async getDetail(postId) {
    try {
      const detailInfo = await models.posts.findOne({include: [{
        model: models.hashtags,
        attributes: [[models.sequelize.fn("group_concat", models.sequelize.col("tag")), "hashtags"]],
        required: false // 해시태그 없으면 값이 안나오는 것을 방지하기 위해 Left Outer Join 사용
      }],
      attributes: ["id", "userId", "title", "content", "likes", "views",
      [models.sequelize.fn("date_format", models.sequelize.col("posts.createdAt"), "%Y-%m-%d %h:%i:%s"), "createdAt"],
      [models.sequelize.fn("date_format", models.sequelize.col("posts.updatedAt"), "%Y-%m-%d %h:%i:%s"), "updatedAt"]],
      where: {id: postId}, group: "posts.id", raw: true});
      return detailInfo;
    } catch (err) {
      throw err;
    }
  }

  static async getClickedLikePost(postId, userId) {
    try {
      const isClickedLikePost = await models.postLikes.findOne({where: {[Op.and]: [{postId: postId}, {userId: userId}]}});
      if (isClickedLikePost == null) {
        return false;
      } return true;
    } catch (err) {
      throw err;
    }
  }
  
  static async setMinusLikes(postId) {
    try {
      await models.posts.increment({likes: -1}, {where: {id: postId}});
    } catch (err) {
      throw err;
    }
  }

  static async setMinusLikeUser(postId, userId) {
    try {
      await models.postLikes.destroy({where: {[Op.and]: [{postId: postId}, {userId: userId}]}});
    } catch (err) {
      throw err;
    }
  }

  static async setAddLikes(postId) {
    try {
      await models.posts.increment({likes: 1}, {where: {id: postId}});
    } catch (err) {
      throw err;
    }
  }

  static async setAddLikeUser(postId, userId) {
    try {
      await models.postLikes.create({postId: postId, userId: userId});
    } catch (err) {
      throw err;
    }
  }

  static async getDeletedList(userId) {
    try {
      const deletedListInfo = await models.posts.findAll({include: [{
        model: models.hashtags,
        attributes: [[models.sequelize.fn("group_concat", models.sequelize.col("tag")), "hashtags"]],
        required: false 
      }],
      attributes: ["id", "title", "content", "likes", "views",
      [models.sequelize.fn("date_format", models.sequelize.col("posts.createdAt"), "%Y-%m-%d %h:%i:%s"), "createdAt"],
      [models.sequelize.fn("date_format", models.sequelize.col("posts.updatedAt"), "%Y-%m-%d %h:%i:%s"), "updatedAt"]],
      where: {[Op.and]: [{state: 1}, {userId: userId}]}, group: "posts.id", raw: true});
      return deletedListInfo;
    } catch (err) {
      throw err;
    }
  }

  static async setRestorePost(postId) {
    try {
      await models.posts.update({state: 0}, {where: {id: postId}});
    } catch (err) {
      throw err;
    }
  }
  
  static async getList(search, sort, orderBy, hashtags, perPage, page) {
    let offset = 0;
    if (page > 1) {
      offset = perPage * (page - 1);
    }
    let searchQuery = true; // 검색어 없을 때 조회할 조건
    if (search != "") {
      searchQuery = `title regexp '${makeSearchWord(search)}'`;
    }
    let hashtagQuery = true; // 해시태그 없을 때 조회할 조건
    if (hashtags != null) {  
      let searchHashtag = hashtags.split(",");
      searchHashtag = searchHashtag.map(x => "'#" + x + "'");
      hashtagQuery = `posts.id in(select postId from hashtags where tag in(${searchHashtag}) group by postId having count(*) = ${searchHashtag.length})`;
    }
    try {
      const listInfo = await models.posts.findAll({include: [{
        model: models.hashtags,
        attributes: [[models.sequelize.fn("group_concat", models.sequelize.col("tag")), "hashtags"]],
        required: false 
      }],
      attributes: ["id", "userId", "title", "content", "likes", "views",
      [models.sequelize.fn("date_format", models.sequelize.col("posts.createdAt"), "%Y-%m-%d %h:%i:%s"), "createdAt"],
      [models.sequelize.fn("date_format", models.sequelize.col("posts.updatedAt"), "%Y-%m-%d %h:%i:%s"), "updatedAt"]],
      where: {[Op.and]: [{state: 0}, models.sequelize.literal(searchQuery), models.sequelize.literal(hashtagQuery)]},
      group: "posts.id", order: [[sort, orderBy]], offset: offset, limit: perPage, subQuery: false, raw: true});
      return listInfo;
    } catch (err) {
      throw err;
    }
  }

  static async getNewPostList(userId) {
    // 팔로잉한 유저의 읽지 않은 새로운 게시글 목록 
    const query1 = `userId in (select follow from followLogs where userId = '${userId}')`;
    const query2 = `posts.id not in (select postId from postLogs where userId = '${userId}')`;
    try {
      const newPostList = await models.posts.findAll({include: [{
        model: models.hashtags,
        attributes: [[models.sequelize.fn("group_concat", models.sequelize.col("tag")), "hashtags"]],
        required: false 
      }],
      attributes: ["id", "userId", "title", "content", "likes", "views",
      [models.sequelize.fn("date_format", models.sequelize.col("posts.createdAt"), "%Y-%m-%d %h:%i:%s"), "createdAt"],
      [models.sequelize.fn("date_format", models.sequelize.col("posts.updatedAt"), "%Y-%m-%d %h:%i:%s"), "updatedAt"]],
      where: {[Op.and]: [{state: 0}, models.sequelize.literal(query1), models.sequelize.literal(query2)]},
      group: "posts.id", raw: true});
      return newPostList;
    } catch (err) {
      throw err;
    }
  }

  // 댓글 기능 구현
  static async setComment(postId, userId, comment) {
    try {
      await models.comments.create({postId: postId, userId: userId, comment: comment});
    } catch (err) {
      throw err;
    }
  }

  static async getByCommentId(commentId) {
    try {
      return await models.comments.findOne({where: {id: commentId}});
    } catch (err) {
      throw err;
    }
  }

  static async getCommentWriter(commentId) {
    try {
      const writer = await models.comments.findOne({attributes: ["userId"], where: {id: commentId}});
      return writer.getDataValue("userId");
    } catch (err) {
      throw err;
    }
  }

  static async setUpdateComment(commentId, comment) {
    try {
      await models.comments.update({comment: comment}, {where: {id: commentId}});
    } catch (err) {
      throw err;
    }
  }

  static async setDeleteComment(commentId) {
    try {
      await models.comments.destroy({where: {id: commentId}});
    } catch (err) {
      throw err;
    }
  }

  static async getClickedLikeComment(commentId, userId) {
    try {
      const isClickedLikeComment = await models.commentLikes.findOne({where: {[Op.and]: [{commentId: commentId}, {userId: userId}]}});
      if (isClickedLikeComment == null) {
        return false;
      } return true;
    } catch (err) {
      throw err;
    }
  }

  static async setMinusCommentLikes(commentId) {
    try {
      await models.comments.increment({likes: -1}, {where: {id: commentId}});
    } catch (err) {
      throw err;
    }
  }

  static async setMinusCommentLikeUser(commentId, userId) {
    try {
      await models.commentLikes.destroy({where: {[Op.and]: [{commentId: commentId}, {userId: userId}]}});
    } catch (err) {
      throw err;
    }
  }
  
  static async setAddCommentLikes(commentId) {
    try {
      await models.comments.increment({likes: 1}, {where: {id: commentId}});
    } catch (err) {
      throw err;
    }
  }
  
  static async setAddCommentLikeUser(commentId, userId) {
    try {
      await models.commentLikes.create({commentId: commentId, userId: userId});
    } catch (err) {
      throw err;
    }
  }

  static async getPostCommentList(postId) {
    try {
      return await models.comments.findAll({where: {postId: postId}});
    } catch (err) {
      throw err;
    }
  }
}

module.exports = PostService;
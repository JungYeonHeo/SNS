const { validationResult } = require("express-validator");
const PostService = require("../services/post.service");
const response = require("../utils/response");
const accessUrl = require("../utils/accessUrl");
const logger = require("../utils/winston");
require("date-utils");

class PostController {
  static async createPost(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({message: errors.errors.map((obj) => obj.msg)});
    }
    logger.info(accessUrl.CREATE);
    const userId = req.user.id;
    const { title, content, hashtags } = req.body;
    try {
      await PostService.create(userId, title, content, hashtags);
      res.status(201).json({message: response.CREATE});
    } catch (err) {
      logger.error(`[${accessUrl.CREATE}] ${userId} ${err}`);
      res.status(500).json({message: response.CREATE_FAIL});
    }
  }

  static async updatePost(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({message: errors.errors.map((obj) => obj.msg)});
    }
    logger.info(accessUrl.UPDATE);
    const userId = req.user.id;
    const postId = req.params.id;
    const { title, content, hashtags } = req.body;
    try {
      const isExist = await PostService.getById(postId);
      if (!isExist) { 
        return res.status(404).json(response.NOT_FOUND);
      }
      const writer = await PostService.getWriter(postId);
      if (userId != writer) {
        return res.status(403).json(response.FORBIDDEN);
      }
      await PostService.update(postId, title, content, hashtags);
      res.status(200).json({message: response.UPDATE});
    } catch (err) {
      logger.error(`[${accessUrl.UPDATE}] ${userId} ${err}`);
      res.status(500).json({message: response.UPDATE_FAIL});
    }
  }

  static async deletePost(req, res) {
    logger.info(accessUrl.DELETE);
    const userId = req.user.id;
    const postId = req.params.id;
    try {
      const isExist = await PostService.getById(postId);
      if (!isExist) { 
        return res.status(404).json(response.NOT_FOUND);
      }
      const writer = await PostService.getWriter(postId);
      if (userId != writer) {
        return res.status(403).json(response.FORBIDDEN);
      }
      await PostService.delete(postId);
      res.status(200).json({message: response.DELETE});
    } catch (err) {
      logger.error(`[${accessUrl.DELETE}] ${userId} ${err}`);
      res.status(500).json({message: response.DELETE_FAIL});
    }
  }

  static async detailPost(req, res) {
    logger.info(accessUrl.DETAIL);
    const userId = req.user.id;
    const postId = req.params.id;
    try {
      const isExist = await PostService.getById(postId);
      if (!isExist) { 
        return res.status(404).json(response.NOT_FOUND);
      }
      const haveSeen = await PostService.getPostLog(postId, userId);
      if (haveSeen) {
        await PostService.setAddMyViews(haveSeen.id);
      } else {
        await PostService.setPostLog(postId, userId);
        await PostService.setAddViews(postId);
      }
      const detailPostInfo = await PostService.getDetail(postId); 
      res.status(200).json({
        message: response.DETAIL, 
        detailInfo: detailPostInfo
      });
    } catch (err) {
      logger.error(`[${accessUrl.DETAIL}] ${userId} ${err}`);
      res.status(500).json({message: response.DETAIL_FAIL});
    }
  }

  static async likePost(req, res) {
    logger.info(accessUrl.LIKE);
    const userId = req.user.id;
    const postId = req.params.id;
    try {
      const isExist = await PostService.getById(postId);
      if (!isExist) { 
        return res.status(404).json(response.NOT_FOUND);
      }
      const isClickedLikePost = await PostService.getClickedLikePost(postId, userId);
      if (isClickedLikePost) {
        await PostService.setMinusLikes(postId);
        await PostService.setMinusLikeUser(postId, userId);
        return res.status(200).json({message: response.LIKE_CANCEL});
      } 
      await PostService.setAddLikes(postId);
      await PostService.setAddLikeUser(postId, userId);
      res.status(200).json({message: response.LIKE});
    } catch (err) {
      logger.error(`[${accessUrl.LIKE}] ${userId} ${err}`);
      res.status(500).json({message: response.LIKE_FAIL});
    }
  }

  static async deletedListPost(req, res) {
    logger.info(accessUrl.DELETEDLIST);
    const userId = req.user.id;
    try {
      const deletedListInfo = await PostService.getDeletedList(userId);
      if (deletedListInfo.length == 0) {
        return res.status(200).json({message: response.DELETE_LIST_NONE});
      } 
      res.status(200).json({
        message: response.DELETE_LIST, 
        deletedListInfo: deletedListInfo
      });
    } catch (err) {
      logger.error(`[${accessUrl.DELETEDLIST}] ${userId} ${err}`);
      res.status(500).json({message: response.DELETE_LIST_FAIL});
    }
  }

  static async restorePost(req, res) {
    logger.info(accessUrl.RESTORE);
    const postId = req.params.id;
    const userId = req.user.id;
    try {
      const isExist = await PostService.getById(postId);
      if (!isExist) { 
        return res.status(404).json(response.NOT_FOUND);
      }
      const writer = await PostService.getWriter(postId);
      if (userId != writer) {
        return res.status(403).json(response.FORBIDDEN);
      }
      await PostService.setRestorePost(postId);
      res.status(200).json({message: response.RESTORE});
    } catch (err) {
      logger.error(`[${accessUrl.RESTORE}] ${userId} ${err}`);
      res.status(500).json({message: response.RESTORE_FAIL});
    }
  }

  static async listPost(req, res) {
    logger.info(accessUrl.LIST);
    const userId = req.user.id;
    let { search, sort, orderBy, hashtags, perPage, page } = req.query;
    if (search == undefined) { search = ""; } 
    if (sort == undefined) { sort = "createdAt"; }
    if (orderBy == undefined) { orderBy = "desc"; }
    if (hashtags == undefined) { hashtags = null; }
    if (perPage == undefined) { perPage = 10; } else  { perPage *= 1 }
    if (page == undefined) { page = 1; } else { page *= 1 }
    const filter = { search: search, sort: sort, orderBy: orderBy, hashtags: hashtags, perPage: perPage, page: page };
    try {
      const listInfo = await PostService.getList(search, sort, orderBy, hashtags, perPage, page);
      if (listInfo.length == 0) {
        return res.status(200).json({
          message: response.LIST_NONE, 
          filter: filter
        });
      } 
      res.status(200).json({
        message: response.LIST, 
        filter: filter,
        listInfo: listInfo
      });
    } catch (err) {
      logger.error(`[${accessUrl.LIST}] ${userId} ${err}`);
      res.status(500).json({message: response.LIST_FAIL});
    }
  }
}

module.exports = PostController;
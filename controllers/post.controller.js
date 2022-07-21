const PostService = require("../services/post.service");
const response = require("../utils/response");
require("date-utils");

class PostController {
  static async createPost(req, res) {
    const userId = req.user.id;
    const { title, content, hashtags } = req.body;
    try {
      await PostService.create(userId, title, content, hashtags);
      res.status(200).json({message: response.CREATE});
    } catch (err) {
      console.log(err);
      res.status(500).json({message: response.CREATE_FAIL});
    }
  }

  static async updatePost(req, res) {
    const userId = req.user.id;
    const postId = req.params.id;
    const { title, content, hashtags } = req.body;
    try {
      const writer = await PostService.getWriter(postId);
      if (userId != writer) {
        res.status(403).json(response.FORBIDDEN);
      }
      const updatedAt = new Date().toFormat("YYYY-MM-DD HH:MI:SS");
      await PostService.update(postId, title, content, hashtags, updatedAt);
      res.status(200).json({message: response.UPDATE});
    } catch (err) {
      console.log(err);
      res.status(500).json({message: response.UPDATE_FAIL});
    }
  }

  static async deletePost(req, res) {
    const userId = req.user.id;
    const postId = req.params.id;
    try {
      const writer = await PostService.getWriter(postId);
      if (userId != writer) {
        res.status(403).json(response.FORBIDDEN);
      }
      await PostService.delete(postId);
      res.status(200).json({message: response.DELETE});
    } catch (err) {
      console.log(err);
      res.status(500).json({message: response.DELETE_FAIL});
    }
  }

  static async detailPost(req, res) {
    const postId = req.params.id;
    try {
      await PostService.setAddViews(postId);
      const detailPostInfo = await PostService.getDetail(postId); 
      res.status(200).json({
        message: response.DETAIL, 
        detailInfo: detailPostInfo
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({message: response.DETAIL_FAIL});
    }
  }

  static async likePost(req, res) {
    const postId = req.params.id;
    const userId = req.user.id;
    try {
      const isClickedLikePost = await PostService.getClickedLikePost(postId, userId);
      if (isClickedLikePost) {
        await PostService.setMinusLikes(postId);
        await PostService.setMinusLikeUser(postId, userId);
        res.status(200).json({message: response.LIKE_CANCEL});
      } else {
        await PostService.setAddLikes(postId);
        await PostService.setAddLikeUser(postId, userId);
        res.status(200).json({message: response.LIKE});
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({message: response.LIKE_FAIL});
    }
  }

  static async deletedListPost(req, res) {
    const userId = req.user.id;
    try {
      const deletedListInfo = await PostService.getDeletedList(userId);
      if (deletedListInfo.length == 0) {
        res.status(200).json({message: response.DELETE_LIST_NONE});
      } else {
        res.status(200).json({
          message: response.DELETE_LIST, 
          deletedListInfo: deletedListInfo
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({message: response.DELETE_LIST_FAIL});
    }
  }

  static async restorePost(req, res) {
    const postId = req.params.id;
    const userId = req.user.id;
    try {
      const writer = await PostService.getWriter(postId);
      if (userId != writer) {
        res.status(403).json(response.FORBIDDEN);
      }
      await PostService.setRestorePost(postId);
      res.status(200).json({message: response.RESTORE});
    } catch (err) {
      console.log(err);
      res.status(500).json({message: response.RESTORE_FAIL});
    }
  }

  static async listPost(req, res) {
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
        res.status(200).json({
          message: response.LIST_NONE, 
          filer: filter
        });
      } else {
        res.status(200).json({
          message: response.LIST, 
          filter: filter,
          listInfo: listInfo
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({message: response.LIST_FAIL});
    }
  }
}

module.exports = PostController;
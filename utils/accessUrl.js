module.exports = {
  CREATE: "POST /post/create",
  UPDATE: "POST /post/update",
  DELETE: "PATCH /post/delete",
  DETAIL: "GET /post/detail",
  LIKE: "PATCH /post/like",
  DELETEDLIST: "GET /post/deletedList",
  RESTORE: "PATCH /post/restore",
  LIST: "GET /post/list",
  CREATE_COMMENT: "POST /post/comment",
  UPDATE_COMMENT: "PATCH /post/comment",
  DELETE_COMMENT: "DELETE /post/comment",
  LIKE_COMMENT: "PATCH /post/comment/like",
  LIST_COMMENT: "GET /post/comment",

  JOIN_EMAIL_CONFIRM: "POST /user/joinEmailConfirm",
  JOIN_RANDOM_NUM_CONFIRM: "POST /user/joinRandomNumberConfirm",
  JOIN: "POST /user/join",
  LOGIN: "POST /user/login",
  LOGIN_CONFIRM: "GET /user/loginConfirm",
  FINDPW: "POST /user/findPw",
  MYINFO: "GET /user/myInfo",
  SEARCH: "GET /user/search",
  FOLLOW: "POST /user/follow",
  FOLLOWING_LIST: "GET /user/followingList",
  FOLLOWER_LIST: "GET /user/followerList",
  UPDATE_USER: "PATCH /user/update",
  LIKELIST: "GET /user/likeList",
};
module.exports = {
  BAD_REQUEST: { status: 400, message: "Bad Request", detail: "잘못된 요청입니다." },
  FORBIDDEN: { status: 403, message: "Forbidden", detail: "권한이 없는 사용자입니다." },
  NOT_FOUND: { status: 404, message: "Not Found", detail: "올바른 경로로 접속하세요." },
  INTERNAL_SERVER_ERROR: { status: 500, message: "Internal Server Error", detail: "서버 에러입니다. 관리자에게 문의하세요." },
  CREATE: { message: "포스팅 되었습니다." },
  UPDATE: { message: "게시글이 수정되었습니다." },
  DELETE: { message: "게시글이 삭제되었습니다. 삭제된 게시글은 복원할 수 있습니다." },
  DETAIL: "상세정보가 조회되었습니다.",
  LIKE: "해당 게시글에 좋아요를 표시했습니다.", 
  LIKE_CANCEL: "해당 게시글에 좋아요를 취소했습니다."
};
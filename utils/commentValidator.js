const { body } = require("express-validator");
const response = require("./response");

const checkComment = [
  body("comment")
    .trim()
    .notEmpty()
    .withMessage(response.COMMENT_EMPTY)
    .bail()
    .custom((comment) => {
      if (comment.toString().replace(/(\s*)/g, "").length > 255 || comment.toString().replace(/(\s*)/g, "").length < 2) {
        return false;
      }
      return true;
    })
    .withMessage(response.COMMENT_LENGTH)
    .bail()
    .not().matches(/\<|\>|\"|\'|\%|\;|\&|\+|\-/g)
    .withMessage(response.COMMENT_INCLUDE_SCRIPT),
];

module.exports = checkComment;
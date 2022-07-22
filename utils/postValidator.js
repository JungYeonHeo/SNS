const { body } = require("express-validator");
const response = require("./response");

const checkPost = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage(response.TITLE_EMPTY)
    .bail()
    .custom((title) => {
      if (title.toString().replace(/(\s*)/g, "").length > 30 || title.toString().replace(/(\s*)/g, "").length < 2) {
        return false;
      }
      return true;
    })
    .withMessage(response.TITLE_LENGTH)
    .bail()
    .not().matches(/\<|\>|\"|\'|\%|\;|\&|\+|\-/g)
    .not().matches(/[&\\+\-%@=\/\\\:;,\.\'\"\^`~\_|\!\/\?\*$<>()\[\]\{\}]/i)
    .withMessage(response.TITLE_INCLUDE_SCRIPT),
  body("content")
    .trim()
    .notEmpty()
    .withMessage(response.CONTENT_EMPTY)
    .bail()
    .custom((content) => {
      if (content.toString().replace(/(\s*)/g, "").length > 255 || content.toString().replace(/(\s*)/g, "").length < 2) {
        return false;
      }
      return true;
    })
    .withMessage(response.CONTENT_LENGTH)
    .bail()
    .not().matches(/\<|\>|\"|\'|\%|\;|\&|\+|\-/g)
    .not().matches(/[&\\+\-%@=\/\\\:;,\.\'\"\^`~\_|\!\/\?\*$<>()\[\]\{\}]/i)
    .withMessage(response.CONTENT_INCLUDE_SCRIPT),
  body("hashtags")
    .optional()
    .trim()
    .not().matches(/\<|\>|\"|\'|\%|\;|\&|\+|\-/g)
    .not().matches(/[&\\+\-%@=\/\\\:;,\.\'\"\^`~\_|\!\/\?\*$<>()\[\]\{\}]/i)
    .withMessage(response.HASHTAG_INCLUDE_SCRIPT),
];

module.exports = checkPost;

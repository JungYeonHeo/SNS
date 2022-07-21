const { body } = require("express-validator");
const response = require("./response");

const checkJoin = [
  body("userId")
    .trim()
    .isEmail()
    .withMessage(response.EMAIL_WARNING), 
  body("userPw")
    .trim()
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}/g)
    .withMessage(response.PW_WARNING),
  body("confirmPw")
    .trim()
    .custom((value, {req}) => {
      if (value !== req.body.userPw) {
        throw new Error(response.COMFIRM_PW_WARNING)
      }
      return true
    }),
  body("userName")
    .trim()
    .isLength({ min: 2, max: 10 })
    .withMessage(response.NAME_WARNING),
];

const checkLogin = [
  body("userId")
    .trim()
    .isEmail()
    .withMessage(response.EMAIL_WARNING),
  body("userPw")
    .trim()
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}/g)
    .withMessage(response.PW_WARNING), 
];

module.exports = { checkJoin, checkLogin };
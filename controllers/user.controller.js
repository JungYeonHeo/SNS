const UserService = require("../services/user.service");
const response = require("../utils/response");
const bcrypt = require("bcrypt");

class UserController {
  static async joinUser(req, res) {
    const { userId, userPw, userName } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashPw = await bcrypt.hash(userPw, salt); 
    try {
      const userInfo = await UserService.isJoined(userId);
      if (userInfo) {
        return res.status(409).json({message: response.JOIN_ID_DUPLICATE});
      } else {
        UserService.join(userId, hashPw, userName);
        return res.status(201).json({message: response.JOIN});
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({message: response.JOIN_FAIL});
    } 
  }

  static async loginUser(req, res) {
    const { userId, userPw } = req.body;
    try {
      const userInfo = await UserService.getUserInfo(userId);
      if (!userInfo) {
        return res.status(400).json({message: response.LOGIN_NO_MATCH});
      }
      const isMatch = await bcrypt.compare(userPw, userInfo.userPw);
      if (!isMatch) {
        return res.status(400).json({message: response.LOGIN_NO_MATCH});
      }
      res.status(200).json({message: response.LOGIN});
    } catch (err) {
      console.log(err);
      res.status(500).json({message: response.LOGIN_FAIL});
    } 
  }
}

module.exports = UserController;
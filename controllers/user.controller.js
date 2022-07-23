const UserService = require("../services/user.service");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const generateAccessToken = require("../utils/generateToken");
const getRequestAccessInfo = require("../utils/getRequestAccessInfo");
const response = require("../utils/response");
const dotenv = require("dotenv");
dotenv.config();

class UserController {
  static async joinUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.errors.map((obj) => obj.msg) });
    }
    const { userId, userPw, userName } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashPw = await bcrypt.hash(userPw, salt); 
    try {
      const userInfo = await UserService.isJoined(userId);
      if (userInfo) {
        return res.status(409).json({message: response.JOIN_ID_DUPLICATE});
      } else {
        await UserService.join(userId, hashPw, userName);
        const { ip, os, device, browser, country, city }  = await getRequestAccessInfo(req, res);
        await UserService.setAccessInfo(userId, ip, os, device, browser, country, city, 0);
        return res.status(201).json({message: response.JOIN});
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({message: response.JOIN_FAIL});
    } 
  }

  static async loginUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.errors.map((obj) => obj.msg) });
    }
    const { userId, userPw } = req.body;
    try {
      const userInfo = await UserService.getUserInfo(userId);
      if (!userInfo) {
        return res.status(422).json({message: response.LOGIN_NO_MATCH});
      }
      const isMatch = await bcrypt.compare(userPw, userInfo.userPw);
      if (!isMatch) {
        return res.status(422).json({message: response.LOGIN_NO_MATCH});
      }
      const { ip, os, device, browser, country, city } = await getRequestAccessInfo(req, res);
      const accessInfo = await UserService.getAccessInfo(userId, ip, os, device, browser);
      /**
       * accessLogs.confirm 
       * 0: 회원가입한 접속 정보 (-> 회원가입한 접속정보로 처음 로그인하면 인증 메일을 보내지 않고 confirm은 2로 값 변경)
       * 1: 로그인한 접속 정보 - 확인중
       * 2: 로그인한 접속 정보 - 확인됨 - 본인 맞음
       * 3: 로그인한 접속 정보 - 확인됨 - 본인 아님 (-> 접속 제한)
       * confirm 값이 3이 아닌 경우에는 일단 접속 허용하고 1과 접속 기록에 없는 경우에는 확인 메일을 보낸다.
       */
      if (accessInfo.confirm == 3) { 
        return res.status(403).json({message: response.ACCESS_DENIED}); 
      }
      if (accessInfo.confirm == 0) {
        await UserService.setConfirmValue(2, accessInfo.id);
      }
      if (accessInfo.confirm == 1 || !accessInfo) { 
        if (!accessInfo) {
          await UserService.setAccessInfo(userId, ip, browser, device, country, city, 1);
        }
        /** 
         * TODO: 확인 메일보내고 답변받으면 confirm 상태 값 변경
         * sendConfirmEmail();
         * setConfirmValue();
         */         
      }
      const accessToken = generateAccessToken(userId);
      console.log("Bearer " + accessToken);
      res.setHeader("authorization", "Bearer " + accessToken);
      return res.status(200).json({message: response.LOGIN});
    } catch (err) {
      console.log(err);
      res.status(500).json({message: response.LOGIN_FAIL});
    } 
  }
}

module.exports = UserController;
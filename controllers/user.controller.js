const UserService = require("../services/user.service");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const generateAccessToken = require("../utils/generateToken");
const getRequestAccessInfo = require("../utils/getRequestAccessInfo");
const response = require("../utils/response");
const accessUrl = require("../utils/accessUrl");
const logger = require("../utils/winston");
const { transporter, loginConfirmOptions } = require("../utils/sendMail");
const dotenv = require("dotenv");
dotenv.config();
require("date-utils");

class UserController {
  static async joinUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.errors.map((obj) => obj.msg) });
    }
    logger.info(accessUrl.JOIN);
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
        logger.info(`[${accessUrl.JOIN}] {userId: ${userId}, ip: ${ip}, os: ${os}, device: ${device}, browser: ${browser}, country: ${country}, city: ${city}}`);
        await UserService.setAccessInfo(userId, ip, os, device, browser, country, city, 0);
        return res.status(201).json({message: response.JOIN});
      }
    } catch (err) {
      logger.error(`[${accessUrl.JOIN}] ${userId} ${err}`);
      res.status(500).json({message: response.JOIN_FAIL});
    } 
  }

  static async loginUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.errors.map((obj) => obj.msg) });
    }
    logger.info(accessUrl.LOGIN);
    const now = new Date().toFormat("YYYY-MM-DD HH:MI");
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
      logger.info(`[${accessUrl.LOGIN}] {userId: ${userId}, ip: ${ip}, os: ${os}, device: ${device}, browser: ${browser}, country: ${country}, city: ${city}}`);
      const accessInfo = await UserService.getAccessInfo(userId, ip, os, device, browser);
      /**
       * accessLogs.confirm 
       * 0: 회원가입한 접속 정보 (-> 회원가입한 접속정보로 처음 로그인하면 인증 메일을 보내지 않고 confirm은 2로 값 변경)
       * 1: 로그인한 접속 정보 - 확인중
       * 2: 로그인한 접속 정보 - 확인됨 - 본인 맞음
       * 3: 로그인한 접속 정보 - 확인됨 - 본인 아님 (-> 접속 제한)
       * confirm 값이 3이 아닌 경우에는 일단 접속 허용하고 1과 접속 기록에 없는 경우에는 확인 메일을 보낸다.
       */
      if (accessInfo) {
        if (accessInfo.confirm == 3) { 
          return res.status(403).json({message: response.ACCESS_DENIED}); 
        }
        if (accessInfo.confirm == 0) {
          await UserService.setConfirmValue(2, accessInfo.id);
        }
        if (accessInfo.confirm == 1) { 
          UserController.sendEmailAfterSetup(userId, accessInfo.id, now, ip, os, device, browser, country, city, res);
        }
      } else {
        const createdAccessInfo = await UserService.setAccessInfo(userId, ip, browser, device, country, city, 1);
        UserController.sendEmailAfterSetup(userId, createdAccessInfo.id, now, ip, os, device, browser, country, city, res);
      }
      const accessToken = generateAccessToken(userId);
      console.log("Bearer " + accessToken);
      res.setHeader("authorization", "Bearer " + accessToken);
      return res.status(200).json({message: response.LOGIN});
    } catch (err) {
      logger.error(`[${accessUrl.LOGIN}] ${userId} ${err}`);
      res.status(500).json({message: response.LOGIN_FAIL});
    } 
  }

  static async sendEmailAfterSetup(userId, id, now, ip, os, device, browser, country, city, res) {
    const confirmAnswer2 = process.env.BASE_URL + `/user/loginConfirm?answer=2&userId=${userId}&id=${id}`;
    const confirmAnswer3 = process.env.BASE_URL + `/user/loginConfirm?answer=3&userId=${userId}&id=${id}`;
    loginConfirmOptions.to = userId;
    loginConfirmOptions.html = `<h2>${response.EMAIL_LOGIN_INFO}</h2>
    <p>${response.EMAIL_LOGIN_TIME}: ${now}</p>
    <p>${response.EMAIL_LOGIN_LOCATION}: ${country} ${city} (${ip})</p>
    <p>${response.EMAIL_LOGIN_DEVICE}: ${device} ${os} ${browser}</p>
    <hr><p>${response.EMAIL_IS_IT_YOU}</p>
    <button onclick=\"location.href(${confirmAnswer2})\">${response.EMAIL_YES}</button> 
    <button onclick=\"location.href(${confirmAnswer3})\">${response.EMAIL_NO}</button>`;
    await transporter.sendMail(loginConfirmOptions, res);
    logger.info(`[${accessUrl.LOGIN}] ${userId} ${response.LOGIN_CONFIRM_SEND_MAIL}`);
  }

  static async loginConfirmUser(req, res) {
    const confirm = req.query.answer;
    const userId = req.query.userId;
    const id = req.query.id;
    try {
      await UserService.setConfirmValue(confirm, id);
      logger.info(`[${accessUrl.LOGINCONFIRM}] ${id} ${userId} ${confirm} ${response.SETTING_ACCESSLOGS_CONFIRM}`);
    } catch (err) {
      logger.error(`[${accessUrl.LOGINCONFIRM}] ${id} ${userId} ${confirm} ${err}`);
    }
  }

  static async myInfoUser(req, res) {
    logger.info(accessUrl.MYINFO);
    const userId = req.user.id;
    try {
      const userInfo = await UserService.getUserInfo(userId);
      res.status(200).json({
        message: response.USER_INFO,
        userId: userInfo.userId,
        userName: userInfo.userName
      }); 
    } catch (err) {
      logger.error(`[${accessUrl.MYINFO}] ${userId} ${err}`);
      res.status(500).json({message: response.USER_INFO_FAIL});
    }
  }

  static async myLikeListUser(req, res) {
    logger.info(accessUrl.LIKELIST);
    const userId = req.user.id;
    try {
      const myLikeList = await UserService.getLikeList(userId);
      if (myLikeList.length == 0) {
        return res.status(200).json({message: response.LIKE_LIST_NONE}); 
      }
      res.status(200).json({
        message: response.LIKE_LIST,
        myLikeList: myLikeList
      }); 
    } catch (err) {
      logger.error(`[${accessUrl.LIKELIST}] ${userId} ${err}`);
      res.status(500).json({message: response.LIKE_LIST_FAIL});
    }
  }
}

module.exports = UserController;
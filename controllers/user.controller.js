const UserService = require("../services/user.service");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const generateAccessToken = require("../utils/generateToken");
const getRequestAccessInfo = require("../utils/getRequestAccessInfo");
const response = require("../utils/response");
const accessUrl = require("../utils/accessUrl");
const logger = require("../utils/winston");
const { transporter, emailConfirmOptions, loginConfirmOptions, tempPWOptions } = require("../utils/sendMail");
const { createRandomNumber, createRandomPassword } = require("../utils/createAuthInfo");
const dotenv = require("dotenv");
dotenv.config();
require("date-utils");

class UserController {
  static async joinEmailConfirmUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.errors.map((obj) => obj.msg) });
    }
    logger.info(accessUrl.JOIN_EMAIL_CONFIRM);
    const { userId } = req.body;
    try {
      const randomNum = createRandomNumber(process.env.RANDOM_NUM_LENGTH);
      const isSaved = await UserService.setRandomAuthNumber(userId, randomNum);
      if (isSaved) {
        UserController.sendIdentificationMail(userId, randomNum, res);
        logger.info(`[${accessUrl.JOIN_EMAIL_CONFIRM}] ${userId} ${response.SEND_EMAIL_CONFIRM}`);
        return res.status(200).json({message: response.SEND_EMAIL_CONFIRM});
      }
    } catch(err) {
      logger.error(`[${accessUrl.JOIN_EMAIL_CONFIRM}] ${userId} ${err}`);
      res.status(500).json({message: response.JOIN_EMAIL_CONFIRM_FAIL});
    }
  }

  static async sendIdentificationMail(userId, randomNum, res) {
    // 이메일 본인 확인 메일 보내기
    emailConfirmOptions.to = userId;
    emailConfirmOptions.html = `<h2>${response.EMAIL_SECRET_KEY}</h2>
    <h4 style='background: #eee; padding: 20px'>${randomNum}</h4>`;
    transporter.sendMail(emailConfirmOptions, res);
    logger.info(`[${accessUrl.JOIN_EMAIL_CONFIRM}] ${userId} ${response.JOIN_EMAIL_CONFIRM_SEND_MAIL}`);
  }

  static async joinRandomNumberConfirmUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.errors.map((obj) => obj.msg) });
    }
    logger.info(accessUrl.JOIN_RANDOM_NUM_CONFIRM);
    const { userId, randomNum } = req.body;
    try {
      const storedRandomNumber = await UserService.getRandomAuthNumber(userId);
      if (storedRandomNumber) {
        if (storedRandomNumber == randomNum) {
          logger.info(`[${accessUrl.JOIN_RANDOM_NUM_CONFIRM}] ${userId} ${response.JOIN_EMAIL_RANDOM_NUM_OK}`);
          return res.status(200).json({message: response.JOIN_EMAIL_RANDOM_NUM_OK, emailConfirm: 1});
        }
        logger.info(`[${accessUrl.JOIN_RANDOM_NUM_CONFIRM}] ${userId} ${response.JOIN_EMAIL_RANDOM_NUM_NO}`);
        return res.status(200).json({message: response.JOIN_EMAIL_RANDOM_NUM_NO, emailConfirm: 0});
      }
      logger.info(`[${accessUrl.JOIN_RANDOM_NUM_CONFIRM}] ${userId} ${response.JOIN_EMAIL_RANDOM_NUM_NOT_VALID}`);
      return res.status(200).json({message: response.JOIN_EMAIL_RANDOM_NUM_NOT_VALID, emailConfirm: 0});
    } catch(err) {
      logger.error(`[${accessUrl.JOIN_RANDOM_NUM_CONFIRM}] ${userId} ${err}`);
      res.status(500).json({message: response.JOIN_RANDOM_NUM_CONFIRM_FAIL});
    }
  }

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
      const tempPw = await UserService.getRandomAuthNumber(userId);
      if (!isMatch && userPw != tempPw) {
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
          UserController.sendLoginConfirmMail(userId, accessInfo.id, now, ip, os, device, browser, country, city, res);
        }
      } else {
        const createdAccessInfo = await UserService.setAccessInfo(userId, ip, os, device, browser, country, city, 1);
        UserController.sendLoginConfirmMail(userId, createdAccessInfo.id, now, ip, os, device, browser, country, city, res);
      }
      const accessToken = generateAccessToken(userId);
      logger.info(`[${accessUrl.LOGIN}] ${userId} ${response.LOGIN}`);
      return res.status(200).json({message: response.LOGIN, token: "Bearer " + accessToken});
    } catch (err) {
      logger.error(`[${accessUrl.LOGIN}] ${userId} ${err}`);
      res.status(500).json({message: response.LOGIN_FAIL});
    } 
  }

  static async sendLoginConfirmMail(userId, id, now, ip, os, device, browser, country, city, res) {
    // 접속한 적 없는 정보로 로그인한 경우, 로그인 본인 확인 메일 보내기
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
    transporter.sendMail(loginConfirmOptions, res);
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

  static async findPwUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.errors.map((obj) => obj.msg) });
    }
    logger.info(accessUrl.FINDPW);
    const { userId } = req.body;
    try {
      const userInfo = await UserService.isJoined(userId);
      if (userInfo) {
        const tempPW = createRandomPassword(process.env.TEMP_PW_LENGTH);
        const isSaved = await UserService.setTempPassword(userId, tempPW);
        if (isSaved) {
          UserController.sendFindPasswordMail(userId, tempPW, res);
          logger.info(`[${accessUrl.FINDPW}] ${userId} ${response.SEND_FIND_PW_MAIL}`);
          return res.status(200).json({message: response.SEND_FIND_PW_MAIL});
        }
      } 
      logger.info(`[${accessUrl.FINDPW}] ${userId} ${response.NOT_USER}`);
      return res.status(200).json({message: response.NOT_USER});
    } catch(err) {
      logger.error(`[${accessUrl.FINDPW}] ${userId} ${err}`);
      res.status(500).json({message: response.FINDPW_FAIL});
    }
  }

  static async sendFindPasswordMail(userId, tempPW, res) {
    // 임시 비밀번호 발급 메일 보내기
    tempPWOptions.to = userId;
    tempPWOptions.html = `<h3>${response.EMAIL_TEMP_PW}</h3> 
    <h2 style='background: #eee; padding: 20px'>${tempPW}</h2>
    <h3 style='color: crimson;'>${response.EMAIL_TEMP_PW_WARNING}</h3>`;
    transporter.sendMail(tempPWOptions, res);
    logger.info(`[${accessUrl.FINDPW}] ${userId} ${response.FIND_PW_SEND_MAIL}`);
  }

  static async searchByUser(req, res) {
    logger.info(accessUrl.SEARCH);
    const userId = req.user.id;
    const { search } = req.body;
    try {
      const userInfo = await UserService.findByIdUserInfo(search);
      const postList = await UserService.findByIdPostList(search);
      logger.info(`[${accessUrl.SEARCH}] ${userId} ${search}${response.SEARCH_BY_NAME}`);
      res.status(200).json({
        message: `${search}${response.SEARCH_BY_NAME}`,
        userId: userInfo.userId,
        userName: userInfo.userName, 
        followers: userInfo.followers,
        followings: userInfo.followings,
        posts: postList.length,
        postList: postList
      }); 
    } catch (err) {
      logger.error(`[${accessUrl.SEARCH}] ${userId} ${search} ${err}`);
      res.status(500).json({message: response.SEARCH_BY_NAME_FAIL});
    }
  }

  static async myInfoUser(req, res) {
    logger.info(accessUrl.MYINFO);
    const userId = req.user.id;
    try {
      const userInfo = await UserService.getUserInfo(userId);
      console.log(userInfo);
      logger.info(`[${accessUrl.MYINFO}] ${userId} ${response.USER_INFO}`);
      res.status(200).json({
        message: response.USER_INFO,
        userId: userInfo.userId,
        userName: userInfo.userName, 
        followers: userInfo.followers,
        followings: userInfo.followings,
      }); 
    } catch (err) {
      logger.error(`[${accessUrl.MYINFO}] ${userId} ${err}`);
      res.status(500).json({message: response.USER_INFO_FAIL});
    }
  }

  static async updateUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.errors.map((obj) => obj.msg) });
    }
    logger.info(accessUrl.UPDATE_USER);
    const { userPw, userName } = req.body;
    const userId = req.user.id;
    try {
      await UserService.setUserInfo(userId, userPw, userName);
      logger.info(`[${accessUrl.UPDATE_USER}] ${userId} ${response.UPDATE_USER_INFO}`);
      res.status(200).json({message: response.UPDATE_USER_INFO}); 
    } catch (err) {
      logger.error(`[${accessUrl.UPDATE_USER}] ${userId} ${err}`);
      res.status(500).json({message: response.UPDATE_USER_INFO_FAIL});
    }
  }

  static async myLikeListUser(req, res) {
    logger.info(accessUrl.LIKELIST);
    const userId = req.user.id;
    try {
      const myLikeList = await UserService.getLikeList(userId);
      if (myLikeList.length == 0) {
        logger.info(`[${accessUrl.LIKELIST}] ${userId} ${response.LIKE_LIST_NONE}`);
        return res.status(200).json({message: response.LIKE_LIST_NONE}); 
      }
      logger.info(`[${accessUrl.LIKELIST}] ${userId} ${response.LIKE_LIST}`);
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
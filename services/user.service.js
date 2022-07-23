const models = require("../models");
const { Op } = require("sequelize");

class UserService {

  static async isJoined(userId) {
    try {
      return await models.users.findOne({where: {userId: userId}});
    } catch (err) {
      throw err;
    }
  }

  static async join(userId, hashPw, userName) {
    try { 
      await models.users.create({userId: userId, userPw: hashPw, userName: userName});
    } catch (err) {
      throw err;
    }
  }

  static async setAccessInfo(userId, ip, os, device, browser, country, city, confirm) {
    try { 
      await models.accessLogs.create({userId: userId, ip: ip, os: os, device: device, browser: browser, country: country, city: city, confirm: confirm});
    } catch (err) {
      throw err;
    }
  }

  static async getAccessInfo(userId, ip, os, device, browser) {
    // ip, os, device, browser가 모두 일치하면 동일한 접속 정보로 판별
    try { 
      return await models.accessLogs.findOne({where: {[Op.and]: [{userId: userId}, {ip: ip}, {os: os}, {device:device}, {browser: browser}]}});
    } catch (err) {
      throw err;
    }
  }

  static async setConfirmValue(confirm, id) {
    try { 
      await models.accessLogs.update({confirm: confirm}, {where: {id: id}});
    } catch (err) {
      throw err;
    }
  }

  static async getUserInfo(userId) {
    try { 
      return await models.users.findOne({where: {userId: userId}});
    } catch (err) {
      throw err;
    }
  }
}

module.exports = UserService;
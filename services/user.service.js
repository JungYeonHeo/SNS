const models = require("../models");
const { Op } = require("sequelize");

class UserService {

  static async isJoined(userId) {
    try {
      return await models.users.findOne({ attributes: ["userId"], }, { where: {userId: userId} });
    } catch (err) {
      throw err;
    }
  }

  static async join(userId, hashPw, userName) {
    try { 
      await models.users.create({ userId: userId, userPw: hashPw, userName: userName });
    } catch (err) {
      throw err;
    }
  }

  static async getUserInfo(userId) {
    try { 
      return await models.users.findOne({ where: {userId: userId} });
    } catch (err) {
      throw err;
    }
  }
}

module.exports = UserService;
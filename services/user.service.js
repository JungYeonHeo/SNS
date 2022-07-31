const models = require("../models");
const redis = require("redis");
const redisPool = require("../config/redisConfig");
const { Op } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

class UserService {

  static async setRandomAuthNumber(userId, randomNum) {
    const client = redis.createClient(redisPool);
    try {
      await client.connect();
      await client.set(userId, randomNum);
      await client.expire(userId, process.env.AUTH_NUM_VAILD_TIME);  
      return true;
    } catch {
      throw err;
    } finally {
      await client.disconnect();
    }
  }

  static async getRandomAuthNumber(userId) {
    const client = redis.createClient(redisPool);
    try {
      await client.connect();
      return await client.get(userId);
    } catch {
      throw err;
    } finally {
      await client.disconnect();
    }
  }

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
      return await models.accessLogs.create({userId: userId, ip: ip, os: os, device: device, browser: browser, country: country, city: city, confirm: confirm});
    } catch (err) {
      throw err;
    }
  }

  static async getAccessInfo(userId, ip, os, device, browser) {
    // ip, os, device, browser가 모두 일치하면 동일한 접속 정보로 판별
    try { 
      return await models.accessLogs.findOne({where: {[Op.and]: [{userId: userId}, {ip: ip}, {os: os}, {device: device}, {browser: browser}]}});
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

  static async getLikeList(userId) {
    try { 
      const query = `select postId from postLikes where userId = '${userId}'`;
      const myLikeList = await models.posts.findAll({include: [{
        model: models.hashtags,
        attributes: [[models.sequelize.fn("group_concat", models.sequelize.col("tag")), "hashtags"]],
        required: false 
      }],
      attributes: ["id", "title", "content", "likes", "views",
      [models.sequelize.fn("date_format", models.sequelize.col("posts.createdAt"), "%Y-%m-%d %h:%i:%s"), "createdAt"],
      [models.sequelize.fn("date_format", models.sequelize.col("posts.updatedAt"), "%Y-%m-%d %h:%i:%s"), "updatedAt"]],
      where: {[Op.and]: [{state: 0}, {id: {[Op.in]: [models.sequelize.literal(query)]}}]}, group: "posts.id", raw: true});
      if (myLikeList == []) {
        return [];
      } return myLikeList;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = UserService;
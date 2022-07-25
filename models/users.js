"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    static associate(models) {
      users.hasMany(models.posts, {
        foreignKey: "userId",
      });
      users.hasMany(models.postLikes, {
        foreignKey: "userId"
      });
      users.hasMany(models.postLogs, {
        foreignKey: "userId"
      });
      users.hasMany(models.accessLogs, {
        foreignKey: "userId"
      });
    }
  }
  users.init({
      userId: {
        primaryKey: true, 
        type: DataTypes.STRING,
      },
      userPw: DataTypes.STRING,
      userName: DataTypes.STRING,
    }, {
      sequelize,
      modelName: "users",
    }
  );
  return users;
};
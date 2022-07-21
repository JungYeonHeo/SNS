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
    }
  }
  users.init({
      userId: DataTypes.STRING,
      password: DataTypes.STRING,
      name: DataTypes.STRING,
    }, {
      sequelize,
      timestamps: false,
      modelName: "users",
    }
  );
  return users;
};
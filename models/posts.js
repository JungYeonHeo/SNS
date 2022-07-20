"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class posts extends Model {
    static associate(models) {
      posts.belongsTo(models.users, {
        foreignKey: { name: "userId", allowNull: false },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      posts.hasMany(models.hashtags, {
        foreignKey: "postId"
      });
    }
  }
  posts.init({
      title: DataTypes.STRING,
      content: DataTypes.TEXT,
      likes: DataTypes.INTEGER,
      views: DataTypes.INTEGER,
      state: DataTypes.INTEGER,
    }, {
      sequelize,
      modelName: "posts",
    }
  );
  return posts;
};
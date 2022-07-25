"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class postLikes extends Model {
    static associate(models) {
      postLikes.belongsTo(models.users, {
        foreignKey: { name: "userId", allowNull: false },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      postLikes.belongsTo(models.posts, {
        foreignKey: { name: "postId", allowNull: false },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  postLikes.init({
  }, {
      sequelize,
      modelName: "postLikes",
    }
  );
  return postLikes;
};
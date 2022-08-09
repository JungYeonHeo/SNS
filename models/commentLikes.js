"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class commentLikes extends Model {
    static associate(models) {
      commentLikes.belongsTo(models.comments, {
        foreignKey: { name: "commentId", allowNull: false },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      commentLikes.belongsTo(models.users, {
        foreignKey: { name: "userId", allowNull: false },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  commentLikes.init({},
    {
      sequelize,
      modelName: "commentLikes",
    }
  );
  return commentLikes;
};
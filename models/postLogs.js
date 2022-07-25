"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class postLogs extends Model {
    static associate(models) {
      postLogs.belongsTo(models.posts, {
        foreignKey: { name: "postId", allowNull: false },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      postLogs.belongsTo(models.users, {
        foreignKey: { name: "userId", allowNull: false },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  postLogs.init({
      userViews: DataTypes.INTEGER,
    },{
      sequelize,
      modelName: "postLogs",
    }
  );
  return postLogs;
};
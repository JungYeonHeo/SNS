"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class hashtags extends Model {
    static associate(models) {
      hashtags.belongsTo(models.posts, {
        foreignKey: { name: "postId", allowNull: false },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  hashtags.init({
      tag: DataTypes.STRING, 
    },{
      sequelize,
      modelName: "hashtags",
    }
  );
  return hashtags;
};
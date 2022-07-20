"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class hashtags extends Model {
    static associate(models) {
      hashtags.belongsTo(models.posts, {
        foreignKey: { name: "PostId", allowNull: false },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      hashtags.belongsTo(models.tags, {
        foreignKey: { name: "tagId", allowNull: false },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  hashtags.init({
    },{
      sequelize,
      modelName: "hashtags",
    }
  );
  return hashtags;
};
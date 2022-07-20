"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class tags extends Model {
    static associate(models) {
      tags.hasMany(models.hashtags, {
        foreignKey: "tagId"
      });
    }
  }
  tags.init({
      tag: DataTypes.STRING,
      posts: DataTypes.INTEGER,
    }, {
      sequelize,
      modelName: "tags",
    }
  );
  return tags;
};
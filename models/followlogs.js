"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class followLogs extends Model {
    static associate(models) {
      followLogs.belongsTo(models.users, {
        foreignKey: { name: "userId", allowNull: false },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      followLogs.belongsTo(models.users, {
        foreignKey: { name: "follow", allowNull: false },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  followLogs.init({
    }, {
      sequelize,
      modelName: "followLogs",
    }
  );
  return followLogs;
};
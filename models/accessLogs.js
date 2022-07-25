"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class accessLogs extends Model {
    static associate(models) {
      accessLogs.belongsTo(models.users, {
        foreignKey: { name: "userId", allowNull: false },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  accessLogs.init({
      ip: DataTypes.STRING,
      os: DataTypes.STRING,
      device: DataTypes.STRING,
      browser: DataTypes.STRING,
      country: DataTypes.STRING,
      city: DataTypes.STRING,
      confirm: DataTypes.INTEGER,
    }, {
      sequelize,
      modelName: "accessLogs",
    }
  );
  return accessLogs;
};
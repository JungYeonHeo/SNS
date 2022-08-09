"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      userId: {
        allowNull: false,
        type: Sequelize.STRING,
        primaryKey: true,
      },
      userPw: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      userName: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      followers: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      followings: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("now()"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("now()"),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
  },
};
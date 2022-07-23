"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("accessLogs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        allowNull: false,
        type: Sequelize.STRING,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        references: {
          model: "users",
          key: "userId",
        },
      },
      ip: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      os: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      device: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      browser: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      country: {
        type: Sequelize.STRING,
      },
      city: {
        type: Sequelize.STRING,
      },
      confirm: {
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
    await queryInterface.dropTable("accessLogs");
  },
};
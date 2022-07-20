"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("hashtags", {
      postId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        references: {
          model: "posts",
          key: "postId"
        },
      },
      tagId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        references: {
          model: "tags",
          key: "tagId"
        },
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("hashtags");
  },
};
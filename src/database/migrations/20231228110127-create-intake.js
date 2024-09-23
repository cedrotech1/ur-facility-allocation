"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Intakes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      startYear: {
        type: Sequelize.STRING,
      },
      startMonth: {
        type: Sequelize.STRING,
      },
      endYear: {
        type: Sequelize.STRING,
      },
      endMonth: {
        type: Sequelize.STRING,
      },
      program_ID: {
        type: Sequelize.INTEGER,
      },
      displayName: {
        type: Sequelize.STRING,
      },
      size: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Intakes");
  },
};

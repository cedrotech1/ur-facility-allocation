"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Schools", [
      {
        name: "BUSINESS",
        college_ID: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "ECONOMICS",
        college_ID: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "SCHOOL OF ARTS, LANGUAGES AND COMMUNICATION STUDIES",
        college_ID: "2",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Schools", null, {});
  },
};

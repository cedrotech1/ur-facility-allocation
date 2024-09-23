"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("departments", [
      {
        id: "1",
        name: "statistic",
        school_ID: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        id: "2",
        name: "BIT",
        school_ID: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Add more user data objects as needed
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("departments", null, {});
  },
};
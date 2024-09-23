"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Campuses", [
      {
        name: "HUYE CAMPUS",
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        name: "GIKONDO CAMPUS",
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Add more user data objects as needed
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Campuses", null, {});
  },
};

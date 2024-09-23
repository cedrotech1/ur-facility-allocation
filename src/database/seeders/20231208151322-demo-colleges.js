"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("colleges", [
      {
        id: "1",
        name: "college of business and economics",
        abbreviation: "CBE",
        campus_id: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        id: "2",
        name: "college of social science",
        abbreviation: "CASS",
        campus_id: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Add more user data objects as needed
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("colleges", null, {});
  },
};
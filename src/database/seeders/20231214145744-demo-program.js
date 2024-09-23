"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("programs", [
      {
        id: "1",
        name: "BIT",
        description:"bachelor in busines ond ict....",
        department_ID: "2",
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        id: "2",
        name: "Accounting",
        description:"bachelor of Accounting",
        department_ID: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Add more user data objects as needed
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("programs", null, {});
  },
};
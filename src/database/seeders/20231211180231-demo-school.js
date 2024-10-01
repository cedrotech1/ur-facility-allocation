"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Schools", [
      {
        name: "Business",
        college_ID: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "school of art",
        college_ID: "2",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Schools", null, {});
  },
};

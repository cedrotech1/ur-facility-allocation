"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Groups",
      [
        {
          name: "BIT GROUP 1",
          intake_id: "1",
          size: 120,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "BIT GROUP 2",
          intake_id: "1",
          size: 70,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "ACC GROUP 1",
          intake_id: "2",
          size: 130,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "ACC GROUP 2",
          intake_id: "2",
          size: 200,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // Add more sample data as needed
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Groups", null, {});
  },
};

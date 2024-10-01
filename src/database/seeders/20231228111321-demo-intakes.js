"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Intakes",
      [
        {
          Year: "2022",
          Month: "January",
          program_ID: "1", // Example program ID
          displayName: "2022 january -  BIT",
          size: 200,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          Year: "2023",
          Month: "February",
          program_ID: "2", // Another example program ID
          displayName: "2023 february - MDE",
          size: 300,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // Add more sample data as needed
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Intakes", null, {});
  },
};

"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Intakes",
      [
        {
          startYear: "2022",
          startMonth: "January",
          endYear: "2023",
          endMonth: "December",
          program_ID: "1", // Example program ID
          displayName: "2022 january - 2023 december BIT",
          size: 200,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          startYear: "2023",
          startMonth: "February",
          endYear: "2024",
          endMonth: "November",
          program_ID: "2", // Another example program ID
          displayName: "2023 february - 2024 november MDE",
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

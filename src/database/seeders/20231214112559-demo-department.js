"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("departments", [
      {
        id: "1",
        name: "INSURANCE",
        school_ID: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        id: "2",
        name: "BANKING",
        school_ID: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      
      {
        id: "3",
        name: "BIT",
        school_ID: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      
      {
        id: "4",
        name: "ACCOUNTING",
        school_ID: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      
      {
        id: "5",
        name: "HRM",
        school_ID: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      
      {
        id: "6",
        name: "MARKETING",
        school_ID: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      
      {
        id: "7",
        name: "FINANCE",
        school_ID: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      
      {
        id: "8",
        name: "Procurement, Logistics and Transport",
        school_ID: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      
      // economics
      {
        id: "9",
        name: "APPLIED STATISTICS",
        school_ID: "2",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "10",
        name: "ECONOMICS",
        school_ID: "2",
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        // specific id coz error
        id: "14",  
        name: "MODERN LANGUAGES AND CULTURES",
        school_ID: "2",
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // DEPARTMENTS IN CASS  SCHOOL OF SCHOOL OF ARTS, LANGUAGES AND COMMUNICATION STUDIES
      {
        id: "11",
        name: "MODERN LANGUAGES AND CULTURES",
        school_ID: "3",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "12",
        name: "JOURNALISM, COMMUNICATION AND INFORMATION SCIENCE",
        school_ID: "3",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "13",
        name: "MODERN LANGUAGES AND CULTURES",
        school_ID: "3",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    

    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("departments", null, {});
  },
};
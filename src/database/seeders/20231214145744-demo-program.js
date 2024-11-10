"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("programs", [

      // insuarrance department 1
      {
        id: "1",
        name: "BACHELOR OF BUSINESS ADMINISTRATION WITH HONORS OPTION: INSURANCE",
        description:"",
        department_ID: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },

         // banking department 2
         {
          id: "2",
          name: "BACHELOR OF BUSINESS ADMINISTRATION WITH HONORS OPTION: BANKING",
          description:"",
          department_ID: "2",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

           // insuarrance department 1
      // {
      //   id: "3",
      //   name: "BACHELOR OF BUSINESS ADMINISTRATION WITH HONORS OPTION: INSURANCE",
      //   description:"",
      //   department_ID: "1",
      //   createdAt: new Date(),
      //   updatedAt: new Date(),
      // },

       // bit department 3
      {
        id: "4",
        name: "BACHELOR OF SCIENCE WITH HONOURS IN BUSINESS INFORMATION TECHNOLOGY",
        description:"ba bit",
        department_ID: "3",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
       // accounting department 4

       {
        id: "5",
        name: "BACHELOR OF SCIENCE IN ACCOUNTING WITH HONORS",
        description:"ba bit",
        department_ID: "4",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
       // hr department 5    BACHELOR OF BUSINESS ADMINISTRATION WITH HONORS OPTION: HUMAN RESOURCES MANAGEMENT
       {
        id: "6",
        name: "BACHELOR OF BUSINESS ADMINISTRATION WITH HONORS OPTION: HUMAN RESOURCES MANAGEMENT",
        description:"",
        department_ID: "5",
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        id: "7",
        name: "BACHELOR OF BUSINESS ADMINISTRATION WITH HONORS OPTION: MARKETING",
        description:"",
        department_ID: "6",
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        id: "8",
        name: "BACHELOR OF BUSINESS ADMINISTRATION WITH HONORS OPTION: FINANCE",
        description:"",
        department_ID: "7",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "9",
        name: "BSc (Honours) in Transport Management",
        description:"",
        department_ID: "8",
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        id: "10",
        name: "BSc (Honours) in Procurement, Logistics and Supply Chain Management",
        description:"",
        department_ID: "8",
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // ECONOMIC

      {
        id: "11",
        name: "Bachelor of Science with Honours in Applied Statistics with Actuarial Sciences",
        description:"",
        department_ID: "9",
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        id: "12",
        name: "BSC (HON) IN INTERNATIONAL ECONOMICS",
        description:"",
        department_ID: "10",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "13",
        name: " BSC (HON) IN MONETARY ECONOMICS",
        description:"",
        department_ID: "10",
        createdAt: new Date(),
        updatedAt: new Date(),
      },

     
      // CASS LELATED COURSES
      {
        id: "14",
        name: "BA (HONS) IN ENGLISH AND FRENCH",
        description:"",
        department_ID: "14",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "15",
        name: "BA (HONS) IN CREATIVE AND PERFORMING ARTS",
        description:"",
        department_ID: "14",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // ...SCIENCE
      {
        id: "16",
        name: "BA (HONS) IN JOURNALISM AND COMMUNICATION",
        description:"",
        department_ID: "12",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "17",
        name: "BA (HONS) IN JOURNALISM AND COMMUNICATION",
        description:"",
        department_ID: "12",
        createdAt: new Date(),
        updatedAt: new Date(),
      }

    ]);

    
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("programs", null, {});
  },
};
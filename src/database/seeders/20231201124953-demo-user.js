"use strict";
import bcrypt from "bcrypt";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const saltRounds = 10; // Number of salt rounds for bcrypt

    // Hashed passwords for different users
    const hashedPasswordAdmin = await bcrypt.hash("1234", saltRounds);
    const hashedPasswordUser = await bcrypt.hash("1234", saltRounds);


    return queryInterface.bulkInsert("Users", [
      {
        firstname: "Root",
        lastname: "User",
        email: "root@example.com",
        phone: "1234567890",
        role: "root",
        status: "active",
        password: hashedPasswordAdmin,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstname: "systemcampusadmin",
        lastname: "systemcampusadmin",
        email: "systemcampusadmin@example.com",
        phone: "9876543210",
        role: "systemcampusadmin",
        campus: 1,
        status: "active",
        password: hashedPasswordUser,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        firstname: "cedro",
        lastname: "mwamba",
        email: "cedrickhakuzimana@gmail.com",
        phone: "9876543210",
        role: "user",
        campus: 1,
        status: "active",
        password: hashedPasswordUser,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  },
};

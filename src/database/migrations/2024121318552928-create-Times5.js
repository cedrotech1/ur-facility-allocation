'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Times', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      defaultgroupid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'DefaultGroups', 
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      facility: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Facilities', 
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      day: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      // startTime: {
      //   type: Sequelize.STRING,
      //   allowNull: false,
      // },
      // endTime: {
      //   type: Sequelize.STRING,
      //   allowNull: false,
      // },
        timeInterval: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Times');
  },
};

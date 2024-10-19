'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('DefaultGroups', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      facilityId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Facilities', 
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      module: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lecturer: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      trimester: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      groups: {
        type:Sequelize.JSON,
        allowNull: true,
      },
      status: {
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
    await queryInterface.dropTable('DefaultGroups');
  },
};

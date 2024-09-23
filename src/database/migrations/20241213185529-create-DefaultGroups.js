// migrations/20230921123456-create-default-group.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('DefaultGroups', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      facilityId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Facilities',
          key: 'id'
        },
        onDelete: 'CASCADE',
      },
      time: {
        type: Sequelize.ENUM('morning', 'afternoon', 'full day', 'evening', 'weekend'),
        allowNull: false
      },
      trimester: {
        type: Sequelize.STRING,
        allowNull: false
      },
      groups: {
        type: Sequelize.JSON,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') 
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') 
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('DefaultGroups');
  }
};

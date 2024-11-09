'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('modules', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      major_area: {
        type: Sequelize.STRING,
        allowNull: true
      },
      subject_code: {
        type: Sequelize.STRING,
        allowNull: true
      },
      subject_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      year_of_study: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      blocks: {
        type: Sequelize.STRING,
        allowNull: true
      },
      credits: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      major_elective: {
        type: Sequelize.STRING,
        allowNull: true
      },
      programID: {  // Use programID here
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'programs',  // Make sure this matches the Programs table name
          key: 'id'
        },
        // onDelete: 'CASCADE', 
        // onUpdate: 'CASCADE' 
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('modules');
  }
};

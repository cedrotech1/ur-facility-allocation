'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Module extends Model {
    static associate(models) {
      Module.belongsTo(models.program, { foreignKey: 'programID', targetKey: 'id', as: 'program'});
    }
  }

  Module.init({
    majorArea: {
      type: DataTypes.STRING
    },
    subjectCode: {
      type: DataTypes.STRING
    },
    subjectName: {
      type: DataTypes.STRING
    },
    yearOfStudy: {
      type: DataTypes.INTEGER
    },
    blocks: {
      type: DataTypes.STRING
    },
    credits: {
      type: DataTypes.INTEGER
    },
    majorElective: {
      type: DataTypes.STRING,
    },
    programID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Program',
        key: 'id'
      },
       field: 'programID'
    }
  }, 
  
  {
    sequelize,
    modelName: 'Module',
    tableName: 'modules',
    underscored: true
  });

  return Module;
};

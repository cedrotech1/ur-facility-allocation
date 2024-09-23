'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class program extends Model {
    static associate(models) {
      program.belongsTo(models.department, { foreignKey: 'department_ID', targetKey: 'id' });
      program.hasMany(models.Intake, { foreignKey: 'program_ID', sourceKey: 'id' });
    }
  }
  program.init({
    name: DataTypes.STRING,
    description:DataTypes.STRING,
    department_ID: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'program',
  });
  return program;
};
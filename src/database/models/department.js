"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class department extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      department.belongsTo(models.School, { foreignKey: "school_ID" });
      department.hasMany(models.program, { foreignKey: "department_ID" });
    }
  }
  department.init(
    {
      name: DataTypes.STRING,
      school_ID: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "department",
    }
  );
  return department;
};

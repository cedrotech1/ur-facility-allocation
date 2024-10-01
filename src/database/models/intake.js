"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Intake extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Intake.belongsTo(models.program, { foreignKey: "program_ID" });
      Intake.hasMany(models.Groups, { foreignKey: "intake_id" });
    }
  }
  Intake.init(
    {
      Year: DataTypes.STRING,
      Month: DataTypes.STRING,
      program_ID: DataTypes.STRING,
      displayName: DataTypes.STRING,
      size: { type: DataTypes.INTEGER, defaultValue: 0 },
    },
    {
      sequelize,
      modelName: "Intake",
    }
  );
  return Intake;
};

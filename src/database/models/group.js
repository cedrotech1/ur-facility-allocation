"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Groups extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Groups.belongsTo(models.Intake, { foreignKey: "intake_id" });
      Groups.belongsTo(models.Users, { foreignKey: "representative", as: "cp" });
    }
  }
  Groups.init(
    {
  
      name: DataTypes.STRING,
      intake_id: DataTypes.INTEGER,
      size: DataTypes.INTEGER,
      code: DataTypes.STRING,
      representative: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Groups",
    }
  );
  return Groups;
};

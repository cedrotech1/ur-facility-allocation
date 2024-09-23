"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class School extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      School.belongsTo(models.college, { foreignKey: "college_ID" });
      School.hasMany(models.department, { foreignKey: "school_ID" });
      School.belongsTo(models.Users, { foreignKey: 'dean', as:"schooldean"});
    }
  }
  School.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: "School name must be unique within a college",
        },
      },
      college_ID: DataTypes.INTEGER,
      dean: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "School",
    }
  );
  return School;
};

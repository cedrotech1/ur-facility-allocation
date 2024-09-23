"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class college extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      college.belongsTo(models.Campus, { foreignKey: "campus_id" });
      college.hasMany(models.School, { foreignKey: "college_ID" });
    }
  }
  college.init(
    {
      name: DataTypes.STRING,
      abbreviation: DataTypes.STRING,
      campus_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "college",
    }
  );
  return college;
};

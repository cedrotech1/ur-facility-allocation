"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Campus, { foreignKey: "campus", as: "campusInfo" });
      // User.belongsTo(models.Facility, { foreignKey: "managerId", as: "manager" });
      // User.belongsTo(models.Facility, { foreignKey: "technicianId", as: "technician" });
    }
  }
  User.init(
    {
      firstname: DataTypes.STRING,
      lastname: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      role: DataTypes.ENUM("root", "superadmin", "systemcampusadmin", "user"),
      image: DataTypes.STRING,
      campus: DataTypes.INTEGER,
      college: DataTypes.INTEGER,
      status: DataTypes.STRING,
      password: DataTypes.STRING,
      privileges: DataTypes.JSON,
      resetPasswordToken: DataTypes.STRING,
      resetPasswordExpires: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Users",
    }
  );

  return User;
};

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Bookings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Bookings.belongsTo(models.Users, { as: "User", foreignKey: "userid" });
      Bookings.belongsTo(models.Facility, {
        as: "Facility",
        foreignKey: "facility",
      });
      Bookings.belongsTo(models.Groups, { as: "Group", foreignKey: "groups" }); // Note the alias here
    }
  }
  Bookings.init(
    {
      userid: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
      facility: {
        type: DataTypes.INTEGER,
        references: {
          model: "Facility",
          key: "id",
        },
      },
      groups: {
        type: DataTypes.JSON,
        references: {
          model: "Groups",
          key: "id",
        },
      },
      startPeriod: DataTypes.STRING,
      endPeriod: DataTypes.STRING,
      date: DataTypes.STRING,
      status: {
        type: DataTypes.STRING,
        defaultValue: "pending",
      },
    },
    {
      sequelize,
      modelName: "Bookings",
    }
  );
  return Bookings;
};

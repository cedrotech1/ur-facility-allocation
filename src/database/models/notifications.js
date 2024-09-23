"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Notifications extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Notifications.belongsTo(models.Users, { foreignKey: "receiver_id" });
      Notifications.belongsTo(models.Bookings, { foreignKey: "booking_id" });
    }
  }
  Notifications.init(
    {
      receiver_id: DataTypes.INTEGER,
      text: DataTypes.STRING,
      type: DataTypes.STRING,
      isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      booking_id: DataTypes.INTEGER,
      facility_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Notifications",
    }
  );
  return Notifications;
};

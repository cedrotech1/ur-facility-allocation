// models/defaultGroup.js
module.exports = (sequelize, DataTypes) => {
    const DefaultGroup = sequelize.define(
      "DefaultGroup",
      {
        facilityId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "Facilities",
            key: "id",
          },
          onDelete: 'CASCADE',
        },
        time: {
          type: DataTypes.ENUM('morning', 'afternoon', 'full day', 'evening', 'weekend'),
          allowNull: false,
        },
        trimester: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        groups: {
            type: DataTypes.JSON,
            references: {
              model: "Groups",
              key: "id",
            },
            allowNull: true,
        },
      },
      {}
    );
  
    DefaultGroup.associate = function(models) {
      DefaultGroup.belongsTo(models.Facility, {
        foreignKey: 'facilityId',
        as: 'facility',
      });

    };
  
    return DefaultGroup;
  };
  
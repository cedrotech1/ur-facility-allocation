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

        module: {
          type: DataTypes.STRING,
          allowNull: false,
        },

        lecturer: {
          type: DataTypes.STRING,
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
        status: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {}
    );
  
    DefaultGroup.associate = function(models) {
      DefaultGroup.belongsTo(models.Facility, {
        foreignKey: 'facilityId',
        as: 'facility',
      });

      DefaultGroup.hasMany(models.Time, {
        foreignKey: 'defaultgroupid',
        as: 'defaultgroupidTimes',
      });

    };
  
    return DefaultGroup;
  };
  
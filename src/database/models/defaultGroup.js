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
          type: DataTypes.INTEGER, // Change to INTEGER if referencing Module ID
          allowNull: false,
          // references: {
          //   model: "Modules",
          //   key: "id",
          // },
        },
  
        lecturer: {
          type: DataTypes.INTEGER, // Change to INTEGER if referencing User ID
          allowNull: false,
          // references: {
          //   model: "Users",
          //   key: "id",
          // },
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
      DefaultGroup.belongsTo(models.Users, { foreignKey: 'lecturer', as:"lecturerdetail"});
      DefaultGroup.belongsTo(models.Module, { foreignKey: 'module', as:"moduledetail"});

      DefaultGroup.hasMany(models.Time, {
        foreignKey: 'defaultgroupid',
        as: 'defaultgroupidTimes',
      });

    };
  
    return DefaultGroup;
  };
  
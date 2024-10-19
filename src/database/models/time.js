// models/defaultGroup.js
module.exports = (sequelize, DataTypes) => {
    const Time = sequelize.define(
      "Time",
      {
        defaultgroupid: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "DefaultGroup",
            key: "id",
          },
          onDelete: 'CASCADE',
        },

        facility: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        day: {
          type: DataTypes.STRING,
          allowNull: false,
        },

        timeInterval: {
          type: DataTypes.STRING,
          allowNull: false,
        },
    
      },
      {}
    );
  
    Time.associate = function(models) {
      Time.belongsTo(models.DefaultGroup, {
        foreignKey: 'defaultgroupid',
        as: 'defaultgroupTime',
      });

    };
  
    return Time;
  };
  
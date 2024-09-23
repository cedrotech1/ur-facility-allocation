// models/facility.js
module.exports = (sequelize, DataTypes) => {
  const Facility = sequelize.define(
    "Facility",
    {
      campus_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Campus",
          key: "id",
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
      },
      size: {
        type: DataTypes.INTEGER,
        validate: {
          min: 1,
        },
      },
      category: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'active',
        validate: {
          isIn: [['active', 'inactive']],
        },
      },
      materials: {
        type: DataTypes.JSON,
      },
      managerId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        allowNull: true,
      },
      technicianId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        allowNull: true,
      },
      defaultGroups: {
        type: DataTypes.JSON,
        references: {
          model: "Groups",
          key: "id",
        },
        allowNull: true,
      },
    },
    {
      indexes: [
        { fields: ['campus_id'] },
        { fields: ['managerId'] },
        { fields: ['technicianId'] },
      ],
    }
  );

  Facility.associate = function (models) {
    Facility.belongsTo(models.Users, {
      foreignKey: "managerId",
      as: "manager",
    });
    Facility.belongsTo(models.Users, {
      foreignKey: "technicianId",
      as: "technician",
    });
    Facility.hasMany(models.DefaultGroup, {
      foreignKey: 'facilityId',
      as: 'facilitydefaultGroups',
    });
  };

  return Facility;
};

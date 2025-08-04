// models/whLocation.model.js

module.exports = (sequelize, DataTypes) => {
  const WHLocation = sequelize.define('WHLocation', {
    Id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    Locations: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    CreatedBy: {
      type: DataTypes.STRING,
      defaultValue: 'SYSTEM',
    },
    CreatedDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    UpdatedBy: DataTypes.STRING,
    UpdatedDate: DataTypes.DATE,
  }, {
    tableName: 'WHLocation',
    timestamps: false,
  });

  return WHLocation;
};

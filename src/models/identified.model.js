// models/identified.model.js

module.exports = (sequelize, DataTypes) => {
  const IdentifiedItem = sequelize.define('IdentifiedItem', {
    Id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    Photos: DataTypes.STRING,
    ItemDescription: DataTypes.STRING,
    BrandMake: DataTypes.STRING,
    ModelVersion: DataTypes.STRING,
    Color: DataTypes.STRING,
    SerialNumber: DataTypes.STRING,
    DistinguishingFeatures: DataTypes.STRING,
    Condition: DataTypes.STRING,
    IdentifiedDate: DataTypes.DATE,
    IdentifiedLocation: DataTypes.STRING,
    Category: DataTypes.STRING,
    Tags: DataTypes.STRING,
    Comments: DataTypes.STRING,
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
    tableName: 'WHTblIdentifiedItems',
    timestamps: false,
  });

  return IdentifiedItem;
};

// models/lostItem.model.js

module.exports = (sequelize, DataTypes) => {
  const LostItemRequest = sequelize.define('LostItemRequest', {
    Id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    Description: { type: DataTypes.STRING(255), allowNull: false },
    Color: DataTypes.STRING(50),
    Size: DataTypes.STRING(50),
    Brand: DataTypes.STRING(100),
    Model: DataTypes.STRING(100),
    DistinguishingFeatures: DataTypes.STRING(255),
    ItemCategory: DataTypes.STRING(100),
    SerialNumber: DataTypes.STRING(100),
    DateTimeWhenLost: DataTypes.DATE,
    Location: DataTypes.STRING(255),
    ItemValue: DataTypes.FLOAT,
    ItemPhoto: DataTypes.STRING(255),
    ProofofOwnership: DataTypes.STRING(255),
    HowtheItemLost: DataTypes.STRING(500),
    ReferenceNumber: DataTypes.STRING(100),
    AdditionalInformation: DataTypes.STRING(500),
    Address: DataTypes.STRING(255),
    OtherRelevantDetails: DataTypes.STRING(500),
    ClaimId: DataTypes.STRING(100),
    IsActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    CreatedBy: DataTypes.STRING(100),
    CreatedDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    UpdatedBy: DataTypes.STRING(100),
    UpdatedDate: DataTypes.DATE
  }, {
    tableName: 'WHTblLostItemRequest',
    timestamps: false,
  });

  return LostItemRequest;
};

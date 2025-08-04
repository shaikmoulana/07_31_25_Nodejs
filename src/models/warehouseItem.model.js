// models/warehouseItem.model.js

module.exports = (sequelize, DataTypes) => {
  const WareHouseItem = sequelize.define('WareHouseItem', {
    Id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    CreatedBy: DataTypes.STRING,
    CreatedDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    UpdatedBy: DataTypes.STRING,
    UpdatedDate: DataTypes.DATE,
    Category: DataTypes.STRING,
    FilePath: DataTypes.STRING,
    WarehouseLocation: DataTypes.STRING, // FK to WHLocation
    Status: DataTypes.STRING,
    Tags: DataTypes.STRING,
    ItemDescription: DataTypes.STRING,
    Comments: DataTypes.STRING,
    IdentifiedLocation: DataTypes.STRING,
    IdentifiedDate: DataTypes.DATE,
    Donated: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    QRSequenceNumber: DataTypes.INTEGER,
    QRGeneratedAt: DataTypes.DATE,
    QRCodeContent: DataTypes.STRING,
    QRCodeImage: DataTypes.BLOB,
    ReceivedBy: DataTypes.STRING,
    ReceivedOn: DataTypes.DATE,
  }, {
    tableName: 'WareHouseItems',
    timestamps: false,
  });

  return WareHouseItem;
};

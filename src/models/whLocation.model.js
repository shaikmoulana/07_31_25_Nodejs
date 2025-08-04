module.exports = (sequelize, DataTypes) => {
  const WHLocation = sequelize.define('WHLocation', {
    Locations: {
      type: DataTypes.STRING,
      primaryKey: true
    }
  }, {
    tableName: 'WHLocation', // Or your actual DB table name
    timestamps: false
  });

  WHLocation.associate = models => {
    // A location can have many warehouse items
    WHLocation.hasMany(models.WareHouseItem, {
      foreignKey: 'WarehouseLocation',
      sourceKey: 'Locations',
      as: 'WareHouseItems'
    });
  };

  return WHLocation;
};

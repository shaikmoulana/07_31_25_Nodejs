module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Roles', {
    Id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    RoleName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 50]
      }
    }
  }, {
    tableName: 'Roles',
    timestamps: false
  });
};

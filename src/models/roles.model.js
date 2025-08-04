// models/roles.model.js

module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    Id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
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
    tableName: 'WHTblRole',
    timestamps: false
  });

  return Role;
};

// models/designation.model.js

module.exports = (sequelize, DataTypes) => {
  const Designation = sequelize.define('Designation', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    createdBy: {
      type: DataTypes.STRING,
      defaultValue: 'SYSTEM'
    },
    createdDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedBy: {
      type: DataTypes.STRING
    },
    updatedDate: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'Designations',
    timestamps: false // or true if you want Sequelize to manage `createdAt` and `updatedAt`
  });


  // Associations (if any)
  Designation.associate = models => {
    Designation.hasMany(models.User, {
      foreignKey: 'designationId',
      as: 'Users'
    });
  };

  return Designation;
};

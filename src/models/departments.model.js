// models/department.model.js
module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define('Department', {
    id: {
      type: DataTypes.UUID,           // or INTEGER if using numeric IDs
      defaultValue: DataTypes.UUIDV4, // auto-generate UUID if you prefer
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
      type: DataTypes.STRING,
      allowNull: true
    },
    updatedDate: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'Departments',
    timestamps: false // Set to true if you want Sequelize to manage createdAt/updatedAt
  });

  // Associations (if any)
  Department.associate = models => {
    Department.hasMany(models.User, {
      foreignKey: 'departmentId',
      as: 'Users'
    });
  };

  return Department;
};

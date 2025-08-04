// models/users.model.js

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    emailId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    employeeID: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phoneNo: {
      type: DataTypes.STRING,
      allowNull: true
    },

    // Foreign Keys
    DesignationId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    DepartmentId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    Role: {
      type: DataTypes.UUID,
      allowNull: true
    },
    ReportingTo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    profile: {
      type: DataTypes.STRING,
      allowNull: true
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
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
    tableName: 'WHTblUser',
    timestamps: false
  });

  return User;
};

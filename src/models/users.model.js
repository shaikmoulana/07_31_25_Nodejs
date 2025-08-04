// src/models/users.model.js

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
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
    employeeID: DataTypes.STRING,
    phoneNo: DataTypes.STRING,
    designation: DataTypes.STRING,
    department: DataTypes.STRING,
    role: DataTypes.STRING,
    reportingTo: DataTypes.STRING,
    profile: DataTypes.STRING,
    location: DataTypes.STRING,
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
    updatedBy: DataTypes.STRING,
    updatedDate: DataTypes.DATE
  }, {
    tableName: 'Users', // or whatever your table name is
    timestamps: false   // disable if you’re managing timestamps manually
  });

  return Users;
};

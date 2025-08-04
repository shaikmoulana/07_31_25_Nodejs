// models/forgotPassword.model.js

module.exports = (sequelize, DataTypes) => {
  const ForgotPassword = sequelize.define('ForgotPassword', {
    Id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ExpiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    IsUsed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    CreatedDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'WHForgotPassword',
    timestamps: false,
  });

  return ForgotPassword;
};

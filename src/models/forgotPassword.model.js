module.exports = (sequelize, DataTypes) => {
  const ForgotPassword = sequelize.define('ForgotPassword', {
    Id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    UserId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ExpiryTime: {
      type: DataTypes.DATE,
      allowNull: false,
      // Set default 10 minutes from now in business logic, not model, or use below for DB default on create
      // defaultValue: () => new Date(Date.now() + 10 * 60000)
    }
  }, {
    tableName: 'ForgotPassword',
    timestamps: false
  });

  ForgotPassword.associate = models => {
    // A ForgotPassword entry belongs to a User (Users table)
    ForgotPassword.belongsTo(models.Users, { foreignKey: 'UserId', as: 'User' });
  };

  return ForgotPassword;
};

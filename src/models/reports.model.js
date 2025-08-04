// models/reports.model.js

module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define('Report', {
    Id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    Title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    Description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'Pending',
    },
    CreatedBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    CreatedDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    UpdatedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    UpdatedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    tableName: 'WHTblReports',
    timestamps: false,
  });

  return Report;
};

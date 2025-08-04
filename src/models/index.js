const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/db.config');

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  logging: false,
});

const db = {};

// ===== Import Models =====
db.Role = require('./roles.model')(sequelize, DataTypes);
db.Department = require('./departments.model')(sequelize, DataTypes);
db.Designation = require('./designations.model')(sequelize, DataTypes);
db.User = require('./users.model')(sequelize, DataTypes);
db.LostItemRequest = require('./lostItem.model')(sequelize, DataTypes);
db.IdentifiedItem = require('./identified.model')(sequelize, DataTypes);
db.WareHouseItem = require('./warehouseItem.model')(sequelize, DataTypes);
db.WHLocation = require('./whLocation.model')(sequelize, DataTypes);
db.ForgotPassword = require('./forgotPassword.model')(sequelize, DataTypes);
db.Report = require('./reports.model')(sequelize, DataTypes);

// ===== Manually invoke associate() where defined =====
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// ===== Associations =====

// User - Designation
db.User.belongsTo(db.Designation, { foreignKey: 'DesignationId' });
db.Designation.hasMany(db.User, { foreignKey: 'DesignationId' });

// User - Department
db.User.belongsTo(db.Department, { foreignKey: 'DepartmentId' });
db.Department.hasMany(db.User, { foreignKey: 'DepartmentId' });

// User - Role
db.User.belongsTo(db.Role, { foreignKey: 'Role', as: 'RoleInfo' });
db.Role.hasMany(db.User, { foreignKey: 'Role', as: 'UsersInRole' });

// Self-reference: ReportingTo
db.User.belongsTo(db.User, { as: 'ReportingToUser', foreignKey: 'ReportingTo' });
db.User.hasMany(db.User, { as: 'Subordinates', foreignKey: 'ReportingTo' });

// LostItemRequest - WareHouseItem
db.LostItemRequest.belongsTo(db.WareHouseItem, { foreignKey: 'ClaimId' });
db.WareHouseItem.hasMany(db.LostItemRequest, { foreignKey: 'ClaimId' });

// LostItemRequest - CreatedByUser / UpdatedByUser
db.LostItemRequest.belongsTo(db.User, { as: 'CreatedByUser', foreignKey: 'CreatedBy' });
db.User.hasMany(db.LostItemRequest, { as: 'CreatedLostItems', foreignKey: 'CreatedBy' });

db.LostItemRequest.belongsTo(db.User, { as: 'UpdatedByUser', foreignKey: 'UpdatedBy' });
db.User.hasMany(db.LostItemRequest, { as: 'UpdatedLostItems', foreignKey: 'UpdatedBy' });

// ForgotPassword - User
db.ForgotPassword.belongsTo(db.User, { foreignKey: 'UserId' });
db.User.hasMany(db.ForgotPassword, { foreignKey: 'UserId' });

// Reports - ReportedByUser
db.Report.belongsTo(db.User, { as: 'ReportedByUser', foreignKey: 'CreatedBy' });
db.User.hasMany(db.Report, { as: 'ReportsByUser', foreignKey: 'CreatedBy' });

// WareHouseItem - WHLocation (if FK is defined)
db.WareHouseItem.belongsTo(db.WHLocation, {
  foreignKey: 'WarehouseLocation',
  targetKey: 'Locations',
  as: 'Location'
});

// Final exports
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

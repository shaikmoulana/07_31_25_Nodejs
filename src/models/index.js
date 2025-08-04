const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/db.config'); // Your DB config file

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  logging: false,
});

const db = {};

// === Import Models ===
db.Roles = require('./role.model')(sequelize, DataTypes);
db.Departments = require('./department.model')(sequelize, DataTypes);
db.Designations = require('./designation.model')(sequelize, DataTypes);
db.Users = require('./user.model')(sequelize, DataTypes);
db.LostItemRequests = require('./lostItemRequest.model')(sequelize, DataTypes);
db.IdentifiedItems = require('./identifiedItem.model')(sequelize, DataTypes);
db.WareHouseItem = require('./warehouseItem.model')(sequelize, DataTypes);
db.WHLocation = require('./whLocation.model')(sequelize, DataTypes);
db.ForgotPassword = require('./forgotPassword.model')(sequelize, DataTypes);
db.Reports = require('./report.model')(sequelize, DataTypes);

// === Associations (Equivalent to OnModelCreating) ===

// Users - Designation
db.Users.belongsTo(db.Designations, { foreignKey: 'DesignationId' });
db.Designations.hasMany(db.Users, { foreignKey: 'DesignationId' });

// Users - Department
db.Users.belongsTo(db.Departments, { foreignKey: 'DepartmentId' });
db.Departments.hasMany(db.Users, { foreignKey: 'DepartmentId' });

// Users - Roles
db.Users.belongsTo(db.Roles, { foreignKey: 'Role' });
db.Roles.hasMany(db.Users, { foreignKey: 'Role' });

// Users - ReportingTo (Self-reference)
db.Users.belongsTo(db.Users, { as: 'ReportingToUser', foreignKey: 'ReportingTo' });
db.Users.hasMany(db.Users, { as: 'Subordinates', foreignKey: 'ReportingTo' });

// LostItemRequests - WareHouseItem
db.LostItemRequests.belongsTo(db.WareHouseItem, { foreignKey: 'ClaimId' });
db.WareHouseItem.hasMany(db.LostItemRequests, { foreignKey: 'ClaimId' });

// LostItemRequests - CreatedByUser
db.LostItemRequests.belongsTo(db.Users, { as: 'CreatedByUser', foreignKey: 'CreatedBy' });
db.Users.hasMany(db.LostItemRequests, { as: 'CreatedByUser', foreignKey: 'CreatedBy' });

// LostItemRequests - UpdatedByUser
db.LostItemRequests.belongsTo(db.Users, { as: 'UpdatedByUser', foreignKey: 'UpdatedBy' });
db.Users.hasMany(db.LostItemRequests, { as: 'UpdatedByUser', foreignKey: 'UpdatedBy' });

// ForgotPassword - User
db.ForgotPassword.belongsTo(db.Users, { foreignKey: 'UserId' });
db.Users.hasMany(db.ForgotPassword, { foreignKey: 'UserId' });

// Reports - ReportedByUser
db.Reports.belongsTo(db.Users, { as: 'ReportedByUser', foreignKey: 'ReportedBy' });
db.Users.hasMany(db.Reports, { as: 'ReportedByUser', foreignKey: 'ReportedBy' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;



module.exports = db;

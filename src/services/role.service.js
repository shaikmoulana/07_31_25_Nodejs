const db = require('../models');
const Role = db.Roles;

module.exports = {
  async getAll() {
  try {
    return await Role.findAll();
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
},

async add(roleData) {
  if (!roleData || !roleData.RoleName) {
    throw new Error("RoleName is required");
  }
  try {
    return await Role.create(roleData);
  } catch (error) {
    console.error('Error adding role:', error);
    throw error;
  }
}
};

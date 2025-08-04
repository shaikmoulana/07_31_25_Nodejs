const roleService = require('../services/role.service');

module.exports = {
  async getAll(req, res) {
    console.info("Fetching all Roles");
    try {
      const roles = await roleService.getAll();
      res.status(200).json(roles);
    } catch (err) {
      console.error("Error fetching roles:", err);
      res.status(500).send("Server error");
    }
  },

  async add(req, res) {
    const roleData = req.body;

    if (!roleData || !roleData.RoleName) {
      console.warn("Invalid model state for creating role");
      return res.status(400).send("RoleName is required");
    }

    try {
      const created = await roleService.add(roleData);
      res.status(201).json(created);
    } catch (err) {
      console.warn(err.message);
      res.status(400).send(err.message);
    }
  }
};

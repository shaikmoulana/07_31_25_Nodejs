const db = require('../models');
const Report = db.Reports;

module.exports = {
  async getAll() {
    try {
      return await Report.findAll();
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw error;
    }
  },

  async get(id) {
    try {
      return await Report.findByPk(id);
    } catch (error) {
      console.error(`Error fetching report with id ${id}:`, error);
      throw error;
    }
  },

  async add(reportData) {
    if (!reportData) throw new Error("Invalid report data");
    try {
      return await Report.create(reportData);
    } catch (error) {
      console.error('Error creating report:', error);
      throw error;
    }
  },

  async update(updateData) {
    try {
      const report = await Report.findByPk(updateData.Id);
      if (!report) throw new Error("Report not found");
      return await report.update(updateData);
    } catch (error) {
      console.error('Error updating report:', error);
      throw error;
    }
  }
};


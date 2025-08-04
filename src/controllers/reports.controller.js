const service = require('../services/reports.service');

module.exports = {
  async getAll(req, res) {
    try {
      console.info("Fetching all Reports");
      const data = await service.getAll();
      res.json(data);
    } catch (e) {
      console.error('Error fetching reports:', e);
      res.status(500).send('Internal server error');
    }
  },

  async get(req, res) {
    try {
      const { id } = req.params;
      console.info(`Fetching Report with id: ${id}`);
      const data = await service.get(id);

      if (!data) {
        console.warn(`Report with id: ${id} not found`);
        return res.status(404).send("Report not found");
      }

      res.json(data);
    } catch (e) {
      console.error('Error fetching report:', e);
      res.status(500).send('Internal server error');
    }
  },

  async add(req, res) {
    const reportData = req.body;

    if (!reportData) {
      console.warn("Invalid model state for creating Report");
      return res.status(400).send("Invalid data");
    }

    try {
      const created = await service.add(reportData);
      return res.status(201).json(created);
    } catch (e) {
      console.warn(e.message);
      return res.status(400).send(e.message);
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const updateDto = req.body;

    if (!updateDto || id !== updateDto.Id) {
      console.warn(`ID mismatch or invalid data for Report id: ${id}`);
      return res.status(400).send("ID mismatch or invalid data");
    }

    try {
      await service.update(updateDto);
      return res.status(204).send();
    } catch (e) {
      if (e.message === 'Report not found') {
        console.warn(e.message);
        return res.status(404).send(e.message);
      }
      console.error('Error updating report:', e);
      return res.status(500).send('Internal server error');
    }
  }
};

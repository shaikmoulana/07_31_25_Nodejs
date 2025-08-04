const service = require('../services/lostItem.service');

module.exports = {
  async getAll(req, res) {
  try {
    const d = await service.getAll();
    res.json(d);
  } catch (e) {
    res.status(500).send('Internal server error');
  }
},

  async getById(req, res) {
    try {
      const item = await service.getById(req.params.id);
      if (!item) return res.status(404).send();
      res.json(item);
    } catch (e) {
      res.status(500).send('Internal server error');
    }
  },

  async getByClaimId(req, res) {
    try {
      const item = await service.getByClaimId(req.params.id);
      if (!item) return res.status(404).send();
      res.json(item);
    } catch (e) {
      res.status(500).send('Internal server error');
    }
  },

  async add(req, res) {
    try {
      const created = await service.add(req.body);
      res.status(201).json(created);
    } catch (e) {
      res.status(400).send(e.message);
    }
  },

  async claim(req, res) {
    try {
      await service.claim(req.body);
      res.json({ message: "Item claimed" });
    } catch (e) {
      res.status(400).send(e.message);
    }
  },

  async uploadPhoto(req, res) {
    try {
      const photoPath = await service.uploadPhoto(req.body);
      res.json({ message: "Uploaded", path: photoPath });
    } catch (e) {
      res.status(500).send(`Internal server error: ${e.message}`);
    }
  },

  async update(req, res) {
    if (req.params.id !== req.body.Id) return res.status(400).send("ID mismatch");
    const ok = await service.update(req.body);
    if (!ok) return res.status(404).send();
    res.status(204).send();
  },

  async delete(req, res) {
    const ok = await service.delete(req.params.id);
    if (!ok) return res.status(404).send();
    res.status(204).send();
  },

  async getLocations(req, res) {
    const locs = await service.getLocations();
    res.json(locs);
  },

  async dashboardData(req, res) {
    const count = await service.claimCount(req.params.location);
    res.json(count);
  },

  async userCountsData(req, res) {
    const count = await service.userCountsData(req.params.user);
    res.json(count);
  },

  async confirmReceipt(req, res) {
    if (req.params.id !== req.body.Id) return res.status(400).send("ID mismatch");
    const ok = await service.updateReceiptStatus(req.body);
    if (!ok) return res.status(404).send();
    res.status(204).send();
  }
};

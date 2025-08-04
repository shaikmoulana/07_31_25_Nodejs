const db = require('../models');
const LostItem = db.LostItemRequests;

module.exports = {
  async getAll() {
    return LostItem.findAll();
  },

  async getById(id) {
    return LostItem.findByPk(id);
  },

  async getByClaimId(claimId) {
    return LostItem.findOne({ where: { ClaimId: claimId } });
  },

  async add(data) {
    return LostItem.create(data);
  },

  async claim(data) {
    const item = await LostItem.create(data);
    return item;
  },

  async uploadPhoto(update) {
    // handle photo storing logic; return path or URL
    return await db.LostItemPhoto.create(update);
  },

  async update(data) {
    const [updated] = await LostItem.update(data, { where: { Id: data.Id } });
    return updated === 1;
  },

  async delete(id) {
    const deleted = await LostItem.destroy({ where: { Id: id } });
    return deleted === 1;
  },

  async getLocations() {
    // distinct locations
    return db.LostItemRequests.findAll({ attributes: [[db.Sequelize.fn('DISTINCT', db.Sequelize.col('Location')), 'Location']] });
  },

  async claimCount(location) {
    // example summary
    return LostItem.count({ where: { Location: location } });
  },

  async userCountsData(user) {
    return LostItem.count({ where: { CreatedBy: user } });
  },

  async updateReceiptStatus(data) {
    const [updated] = await LostItem.update({ ReceiptConfirmed: true }, { where: { Id: data.Id } });
    return updated === 1;
  },
};

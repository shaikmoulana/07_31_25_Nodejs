const db = require('../models');
const IdentifiedItems = db.IdentifiedItems;

exports.getAll = async () => {
  try {
    return await IdentifiedItems.findAll();
  } catch (error) {
    console.error('Error fetching identified items:', error);
    throw error;
  }
};

exports.addItem = async (data) => {
  try {
    return await IdentifiedItems.create(data);
  } catch (error) {
    console.error('Error adding identified item:', error);
    throw error;
  }
};


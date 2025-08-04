const db = require('../models');
const User = db.User;

class UserRepository {
  async getAll() {
    try {
      return await User.findAll();
    } catch (error) {
      console.error('Error in UserRepository.getAll:', error);
      throw new Error('Could not retrieve users.');
    }
  }

  async get(id) {
    try {
      return await User.findByPk(id);
    } catch (error) {
      console.error('Error in UserRepository.get:', error);
      throw new Error('Could not retrieve the user.');
    }
  }

  async create(user) {
    try {
      return await User.create(user);
    } catch (error) {
      console.error('Error in UserRepository.create:', error);
      throw new Error('Could not create the user.');
    }
  }

  async update(user) {
    try {
      const existing = await User.findByPk(user.id);
      if (!existing) return null;

      return await existing.update(user);
    } catch (error) {
      console.error('Error in UserRepository.update:', error);
      throw new Error('Could not update the user.');
    }
  }

  async delete(id) {
    try {
      const user = await User.findByPk(id);
      if (!user) return false;

      await user.destroy();
      return true;
    } catch (error) {
      console.error('Error in UserRepository.delete:', error);
      throw new Error('Could not delete the user.');
    }
  }
}

module.exports = new UserRepository();

// repositories/userRepository.js

const db = require('../models');
const User = db.Users; // or db.User, adjust as per your model file

class UserRepository {
  // Fetch all users
  async getAll() {
    try {
      return await User.findAll();
    } catch (error) {
      console.error('Error in getAll:', error);
      throw error;
    }
  }

  // Fetch user by ID
  async get(id) {
    try {
      return await User.findByPk(id);
    } catch (error) {
      console.error('Error in get:', error);
      throw error;
    }
  }

  // Create a new user
  async create(user) {
    try {
      const created = await User.create(user);
      return created;
    } catch (error) {
      console.error('Error in create:', error);
      throw error;
    }
  }

  // Update user (expects user object with valid ID)
  async update(user) {
    try {
      const existing = await User.findByPk(user.id);
      if (!existing) return null;

      await existing.update(user);
      return existing;
    } catch (error) {
      console.error('Error in update:', error);
      throw error;
    }
  }

  // Delete user by ID
  async delete(id) {
    try {
      const user = await User.findByPk(id);
      if (!user) return false;

      await user.destroy();
      return true;
    } catch (error) {
      console.error('Error in delete:', error);
      throw error;
    }
  }
}

module.exports = new UserRepository();

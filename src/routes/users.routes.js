const express = require('express');
const router = express.Router();
const { UserCreateDTO } = require('../dtos/user.dto');
const { validationResult } = require('express-validator');
const userController = require('../controllers/user.controller');

// Create user
router.post('/create', UserCreateDTO, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const user = await userController.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create user', error: err.message });
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await userController.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await userController.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user', error: err.message });
  }
});

// Update user
router.put('/:id', UserCreateDTO, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const updatedUser = await userController.updateUser(req.params.id, req.body);
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user', error: err.message });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await userController.deleteUser(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user', error: err.message });
  }
});

module.exports = router;
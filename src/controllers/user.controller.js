const { validationResult } = require('express-validator');
const userService = require('../services/user.service');
const logger = require('../utils/logger'); // optional: winston or similar
const { UserDTO } = require('../dtos/user.dto');

// Create user
exports.createUser = async (userData) => {
  return await userService.create(userData);
};

// Get all users
exports.getAllUsers = async () => {
  return await userService.getAll();
};

// Get user by ID
exports.getUserById = async (id) => {
  return await userService.getById(id);
};

// Update user
exports.updateUser = async (id, userData) => {
  return await userService.update(id, userData);
};

// Delete user
exports.deleteUser = async (id) => {
  return await userService.delete(id);
};

// GET: Get all users
exports.getAll = async (req, res) => {
  try {
    logger.info('Fetching all employees');
    const users = await userService.getAll();
    res.json(users);
  } catch (err) {
    logger.error('Error fetching users', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET: Get user by ID
exports.getById = async (req, res) => {
  const { id } = req.params;
  try {
    logger.info(`Fetching employee with id: ${id}`);
    const user = await userService.getById(id);
    if (!user) {
      logger.warn(`Employee with id: ${id} not found`);
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    logger.error(`Error fetching user by ID ${id}`, err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// POST: Create user
exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Invalid model state for creating employee');
    return res.status(400).json({ errors: errors.array() });
  }

  logger.info('Creating a new employee');
  try {
    const createdUser = await userService.create(req.body);
    res.status(201).json(createdUser); // or use `res.location` if needed
  } catch (err) {
    logger.warn(err.message);
    res.status(400).json({ message: err.message });
  }
};

// POST: Upload file
exports.uploadFile = async (req, res) => {
  try {
    const filePath = await userService.uploadFile(req); // pass `req` for file/multipart
    res.json({ message: 'Your file is uploaded successfully.', path: filePath });
  } catch (err) {
    logger.error('Error uploading file', err);
    res.status(500).json({ message: 'Internal server error: ' + err.message });
  }
};

// PUT: Update user
exports.update = async (req, res) => {
  const { id } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Invalid model state for updating employee');
    return res.status(400).json({ errors: errors.array() });
  }

  if (id !== req.body.Id) {
    logger.warn(`Employee id: ${id} does not match with request body`);
    return res.status(400).json({ message: 'Employee ID mismatch.' });
  }

  try {
    await userService.update(id, req.body);
    res.sendStatus(204); // No content
  } catch (err) {
    logger.warn(err.message);
    res.status(404).json({ message: err.message });
  }
};

// PATCH: Soft delete user
exports.delete = async (req, res) => {
  const { id } = req.params;
  logger.info(`Deleting employee with id: ${id}`);
  try {
    const success = await userService.delete(id);
    if (!success) {
      logger.warn(`Employee with id: ${id} not found`);
      return res.status(404).json({ message: 'User not found' });
    }
    res.sendStatus(204);
  } catch (err) {
    logger.error(`Error deleting user: ${id}`, err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

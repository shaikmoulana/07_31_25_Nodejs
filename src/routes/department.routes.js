const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/department.controller');

// GET all
router.get('/', departmentController.getAllDepartments);

// GET by ID
router.get('/:id', departmentController.getDepartmentById);

// POST create
router.post('/', departmentController.addDepartment);

// PUT update
router.put('/:id', departmentController.updateDepartment);

// PATCH soft delete
router.patch('/:id', departmentController.deleteDepartment);

module.exports = router;

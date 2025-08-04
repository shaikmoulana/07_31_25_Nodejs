const express = require('express');
const router = express.Router();
const designationController = require('../controllers/designation.controller');

// GET all
router.get('/', designationController.getAllDesignations);

// GET by ID
router.get('/:id', designationController.getDesignationById);

// POST create
router.post('/', designationController.addDesignation);

// PUT update
router.put('/:id', designationController.updateDesignation);

// PATCH soft delete
router.patch('/:id', designationController.deleteDesignation);

module.exports = router;

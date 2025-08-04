// designation.dto.js (or similar)

module.exports = {
  id: null,         // Use lowercase to align with service/controller
  name: '',
  users: []         // Optional related entities, camelCase preferred
};

// Validation rules - designation.validator.js

const { body } = require('express-validator');

const DesignationCreateDTO = [
  body('name')
    .trim()
    .notEmpty().withMessage('The name field is required.')
    .isLength({ min: 3, max: 50 })
    .matches(/^[a-zA-Z\s]+$/).withMessage('Special characters and digits are not allowed.')
];

const DesignationUpdateDTO = [
  body('id').notEmpty().withMessage('Id is required.'),
  ...DesignationCreateDTO
];

module.exports = {
  DesignationCreateDTO,
  DesignationUpdateDTO
};

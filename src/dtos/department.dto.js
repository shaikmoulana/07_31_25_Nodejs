const { body } = require('express-validator');

// DepartmentCreateDTO
const DepartmentCreateDTO = [
  body('Name')
    .notEmpty().withMessage('The Name field is required.')
    .isLength({ min: 3, max: 50 })
    .matches(/^[a-zA-Z\s]+$/).withMessage('Special characters and digits are not allowed.')
];

// DepartmentUpdateDTO (reuses CreateDTO and adds Id)
const DepartmentUpdateDTO = [
  body('Id').notEmpty().withMessage('Id is required.'),
  ...DepartmentCreateDTO
];

// ✅ Export both in a single object
module.exports = {
  DepartmentCreateDTO,
  DepartmentUpdateDTO
};

const { body } = require('express-validator');

// Custom validator to ensure email contains 'miraclesoft.com'
const validateMiracleEmail = (value) => {
  if (!value.includes('miraclesoft.com')) {
    throw new Error("Email must contain 'miraclesoft.com'");
  }
  return true;
};

// Validation chain for creating a new User
const UserCreateDTO = [
  body('name')
    .trim()
    .notEmpty().withMessage('The Name field is required.')
    .isLength({ min: 3, max: 50 }).withMessage('Name must be between 3 and 50 characters.')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Special characters and digits are not allowed.'),
  
  body('designation').optional().isLength({ max: 36 }).withMessage('Designation max length is 36.'),

  body('employeeID')
    .trim()
    .notEmpty().withMessage('EmployeeID is required.')
    .isLength({ min: 4, max: 8 }).withMessage('EmployeeID must be between 4 and 8 digits.')
    .matches(/^[0-9\s]+$/).withMessage('EmployeeID allows only digits.'),

  body('emailId')
    .trim()
    .notEmpty().withMessage('EmailId is required.')
    .isEmail().withMessage('EmailId must be a valid email address.')
    .custom(validateMiracleEmail),

  body('password')
    .notEmpty().withMessage('Password is required.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,}$/)
    .withMessage('Password must be at least 8 characters, include uppercase, lowercase, number, and special character.'),

  body('phoneNo')
    .trim()
    .notEmpty().withMessage('PhoneNo is required.')
    .isLength({ min: 10, max: 10 }).withMessage('PhoneNo must be exactly 10 digits.')
    .matches(/^[0-9]+$/).withMessage('PhoneNo must be numeric.'),

  body('role')
    .notEmpty().withMessage('Role is required.'),

  // Optional fields (trimmed when strings)
  body('department').optional().trim(),
  body('reportingTo').optional().trim(),
  body('profile').optional().trim(),
  body('location').optional().trim(),
];

// Validation chain for updating a User, includes an Id field check
const UserUpdateDTO = [
  body('id').notEmpty().withMessage('Id is required.'),
  ...UserCreateDTO
];

module.exports = { UserCreateDTO, UserUpdateDTO };

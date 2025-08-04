module.exports = {
  id: null,                // User's unique ID
  name: '',                // Full Name
  emailId: '',             // Email address
  employeeID: '',          // Employee ID
  phoneNo: '',             // Phone Number
  designation: '',         // Designation name
  department: '',          // Department name
  role: '',                // Role name
  reportingTo: '',         // Name or ID of Reporting Manager
  profile: '',             // Profile picture file name or path
  location: '',            // User's location

  // Relationships (optional, typically populated by ORM queries)
  designationObj: null,
  departmentObj: null,
  roleObj: null,
  reportingToUser: null,

  // Auditing fields
  isActive: true,
  createdBy: 'SYSTEM',
  createdDate: new Date(),
  updatedBy: null,
  updatedDate: null,
  
  // Additional relations (if used)
  forgotPasswordRecords: [],
  subordinates: [],
  createdByUser: [],
  updatedByUser: [],
  reportedByUser: []
};

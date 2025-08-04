module.exports = {
  Id: () => require('crypto').randomUUID(),
  IsActive: false,
  CreatedBy: 'SYSTEM',
  CreatedDate: new Date(),
  UpdatedBy: null,
  UpdatedDate: null
};

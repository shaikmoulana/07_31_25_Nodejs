const { User, Department, Designation, Role } = require('../models');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs').promises; // use promises API
const fsSync = require('fs'); // for sync existsSync
const sanitize = require('sanitize-filename'); // install this package for safe file names

class UserService {
  // Get all users with related info
  async getAll() {
    try {
      const users = await User.findAll({
        include: [
          { model: Department, as: 'Department' },
          { model: Designation, as: 'Designation' },
          { model: Role, as: 'Roles' },
          { model: User, as: 'ReportingToUser' }
        ]
      });

      return users.map(u => ({
        id: u.id,
        name: u.name,
        designation: u.Designation?.name,
        employeeID: u.employeeID,
        emailId: u.emailId,
        department: u.Department?.name,
        reportingTo: u.ReportingToUser?.name,
        isActive: u.isActive,
        createdBy: u.createdBy,
        createdDate: u.createdAt,
        updatedBy: u.updatedBy,
        updatedDate: u.updatedAt,
        profile: u.profile,
        phoneNo: u.phoneNo,
        role: u.Roles?.roleName,
        location: u.location,
      }));
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  }

  // Get user by ID with related info
  async getById(id) {
    try {
      const user = await User.findByPk(id, {
        include: [
          { model: Department, as: 'Department' },
          { model: Designation, as: 'Designation' },
          { model: Role, as: 'Roles' },
          { model: User, as: 'ReportingToUser' }
        ]
      });

      if (!user) return null;

      return {
        id: user.id,
        name: user.name,
        designation: user.Designation?.name,
        employeeID: user.employeeID,
        emailId: user.emailId,
        department: user.Department?.name,
        reportingTo: user.ReportingToUser?.name,
        isActive: user.isActive,
        createdBy: user.createdBy,
        createdDate: user.createdAt,
        updatedBy: user.updatedBy,
        updatedDate: user.updatedAt,
        profile: user.profile,
        phoneNo: user.phoneNo,
        role: user.Roles?.roleName,
        location: user.location,
      };
    } catch (error) {
      console.error(`Error fetching user by id ${id}:`, error);
      throw error;
    }
  }

  // Add a new user - checks uniqueness and hashes password asynchronously
  async add(userDto) {
    try {
      // Check uniqueness
      const [nameExists, idExists, emailExists, phoneExists] = await Promise.all([
        User.findOne({ where: { name: userDto.name } }),
        User.findOne({ where: { employeeID: userDto.employeeID } }),
        User.findOne({ where: { emailId: userDto.emailId } }),
        User.findOne({ where: { phoneNo: userDto.phoneNo } })
      ]);

      if (nameExists) throw new Error("Employee Name must be unique.");
      if (idExists) throw new Error("Employee ID must be unique.");
      if (emailExists) throw new Error("Email ID must be unique.");
      if (phoneExists) throw new Error("Phone number must be unique.");

      // Validate related entities
      const designation = await Designation.findOne({ where: { name: userDto.designation } });
      if (!designation) throw new Error("Invalid Designation");

      const department = await Department.findOne({ where: { name: userDto.department } });
      if (!department) throw new Error("Invalid Department");

      const role = await Role.findOne({ where: { roleName: userDto.role } });
      if (!role) throw new Error("Invalid Role");

      const reportingTo = userDto.reportingTo
        ? await User.findOne({ where: { name: userDto.reportingTo } })
        : null;

      const hashedPassword = await bcrypt.hash(userDto.password, 10);

      const user = await User.create({
        name: userDto.name,
        employeeID: userDto.employeeID,
        emailId: userDto.emailId,
        phoneNo: userDto.phoneNo,
        profile: userDto.profile || null,
        location: userDto.location,
        password: hashedPassword,
        designationId: designation.id,
        departmentId: department.id,
        reportingTo: reportingTo?.id,
        roleId: role.id,
        isActive: true,
        createdBy: 'SYSTEM',
      });

      return { ...userDto, id: user.id };
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  }

  // Update user with uniqueness checks (excluding current user), async password hashing
  async update(userDto) {
    try {
      const user = await User.findByPk(userDto.id);
      if (!user) throw new Error("Employee not found");

      // Uniqueness checks excluding current user
      const [nameExists, idExists, emailExists, phoneExists] = await Promise.all([
        User.findOne({ where: { name: userDto.name, id: { [User.sequelize.Op.ne]: userDto.id } } }),
        User.findOne({ where: { employeeID: userDto.employeeID, id: { [User.sequelize.Op.ne]: userDto.id } } }),
        User.findOne({ where: { emailId: userDto.emailId, id: { [User.sequelize.Op.ne]: userDto.id } } }),
        User.findOne({ where: { phoneNo: userDto.phoneNo, id: { [User.sequelize.Op.ne]: userDto.id } } }),
      ]);

      if (nameExists) throw new Error("Employee Name must be unique.");
      if (idExists) throw new Error("Employee ID must be unique.");
      if (emailExists) throw new Error("Email ID must be unique.");
      if (phoneExists) throw new Error("Phone number must be unique.");

      const [designation, department, role, reportingTo] = await Promise.all([
        Designation.findOne({ where: { name: userDto.designation } }),
        Department.findOne({ where: { name: userDto.department } }),
        Role.findOne({ where: { roleName: userDto.role } }),
        userDto.reportingTo ? User.findOne({ where: { name: userDto.reportingTo } }) : null,
      ]);

      if (!designation) throw new Error("Invalid Designation");
      if (!department) throw new Error("Invalid Department");
      if (!role) throw new Error("Invalid Role");

      user.name = userDto.name;
      user.employeeID = userDto.employeeID;
      user.emailId = userDto.emailId;
      user.phoneNo = userDto.phoneNo;
      user.profile = userDto.profile || null;
      user.location = userDto.location;

      // If password provided, hash, else keep old password
      if (userDto.password) {
        user.password = await bcrypt.hash(userDto.password, 10);
      }

      user.designationId = designation.id;
      user.departmentId = department.id;
      user.reportingTo = reportingTo?.id || null;
      user.roleId = role.id;
      user.updatedBy = userDto.updatedBy;

      await user.save();

      return userDto;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Soft delete user by id
  async delete(id) {
    try {
      const user = await User.findByPk(id);
      if (!user) throw new Error("User not found");

      user.isActive = false;
      await user.save();

      return true;
    } catch (error) {
      console.error(`Error deleting user with id ${id}:`, error);
      throw error;
    }
  }

  // Upload user profile file asynchronously, sanitize filenames, update user
  async uploadFile(userProfile) {
    try {
      const uploadDir = path.resolve('uploads');
      if (!fsSync.existsSync(uploadDir)) {
        fsSync.mkdirSync(uploadDir);
      }

      // Sanitize filename to prevent path traversal or invalid chars
      const sanitizedFilename = sanitize(userProfile.file.originalname);
      const filePath = path.join(uploadDir, sanitizedFilename);

      await fs.writeFile(filePath, userProfile.file.buffer);

      if (userProfile.id) {
        const user = await User.findByPk(userProfile.id);
        if (user) {
          user.profile = sanitizedFilename;
          await user.save();
        }
      }

      // Return relative path to saved file (can be adjusted as per your need)
      return filePath;
    } catch (error) {
      console.error('Error uploading user profile file:', error);
      throw error;
    }
  }
}

module.exports = new UserService();

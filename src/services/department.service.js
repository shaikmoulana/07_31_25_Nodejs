// const { Department } = require('../models'); // Sequelize model
const { Departments: Department } = require('../models');

const { Op } = require('sequelize');

class DepartmentService {
    async getAll() {
        const departments = await Department.findAll();

        return departments.map(dept => ({
            id: dept.id,
            name: dept.name,
            isActive: dept.isActive,
            createdBy: dept.createdBy,
            createdDate: dept.createdDate,
            updatedBy: dept.updatedBy,
            updatedDate: dept.updatedDate
        }));
    }

    async get(id) {
        const dept = await Department.findByPk(id);

        if (!dept) return null;

        return {
            id: dept.id,
            name: dept.name,
            isActive: dept.isActive,
            createdBy: dept.createdBy,
            createdDate: dept.createdDate,
            updatedBy: dept.updatedBy,
            updatedDate: dept.updatedDate
        };
    }

    async add(deptDto) {
        // Check for duplicate name
        const existing = await Department.findOne({ where: { name: deptDto.name } });
        if (existing) {
            throw new Error('A department with the same name already exists.');
        }

        const department = await Department.create({
            name: deptDto.name,
            isActive: true,
            createdBy: 'SYSTEM',
            createdDate: new Date()
        });

        return {
            ...deptDto,
            id: department.id
        };
    }

    async update(deptDto) {
        const department = await Department.findByPk(deptDto.id);
        if (!department) {
            throw new Error('Department not found');
        }

        department.name = deptDto.name;
        department.updatedBy = deptDto.updatedBy;
        department.updatedDate = new Date();

        await department.save();

        return deptDto;
    }

    async delete(id) {
        const department = await Department.findByPk(id);
        if (!department) {
            throw new Error(`Department with ID ${id} not found.`);
        }

        department.isActive = false;
        await department.save();

        return true;
    }
}

module.exports = new DepartmentService();

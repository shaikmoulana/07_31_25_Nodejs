const { Designation } = require('../models'); // Sequelize model
const { Op } = require('sequelize');

class DesignationService {
    async getAll() {
        const designations = await Designation.findAll();

        return designations.map(d => ({
            id: d.id,
            name: d.name,
            isActive: d.isActive,
            createdBy: d.createdBy,
            createdDate: d.createdDate,
            updatedBy: d.updatedBy,
            updatedDate: d.updatedDate
        }));
    }

    async get(id) {
        const d = await Designation.findByPk(id);
        if (!d) return null;

        return {
            id: d.id,
            name: d.name,
            isActive: d.isActive,
            createdBy: d.createdBy,
            createdDate: d.createdDate,
            updatedBy: d.updatedBy,
            updatedDate: d.updatedDate
        };
    }

    async add(designationDTO) {
        const existing = await Designation.findOne({
            where: { name: designationDTO.name }
        });

        if (existing) {
            throw new Error('A designation with the same name already exists.');
        }

        const newDesignation = await Designation.create({
            name: designationDTO.name,
            isActive: true,
            createdBy: 'SYSTEM',
            createdDate: new Date()
        });

        designationDTO.id = newDesignation.id;
        return designationDTO;
    }

    async update(designationDTO) {
        const designation = await Designation.findByPk(designationDTO.id);
        if (!designation) {
            throw new Error('Designation not found');
        }

        designation.name = designationDTO.name;
        designation.updatedBy = designationDTO.updatedBy;
        designation.updatedDate = new Date();

        await designation.save();

        return designationDTO;
    }

    async delete(id) {
        const designation = await Designation.findByPk(id);
        if (!designation) {
            throw new Error(`Designation with ID ${id} not found.`);
        }

        designation.isActive = false; // Soft delete
        await designation.save();

        return true;
    }
}

module.exports = new DesignationService();

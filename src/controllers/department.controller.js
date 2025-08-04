const departmentService = require('../services/department.service');

const getAllDepartments = async (req, res) => {
    try {
        console.info('Fetching all departments');
        const departments = await departmentService.getAll();
        res.status(200).json(departments);
    } catch (err) {
        console.error('Error fetching departments:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getDepartmentById = async (req, res) => {
    const { id } = req.params;
    try {
        console.info(`Fetching department with ID: ${id}`);
        const department = await departmentService.get(id);
        if (!department) {
            console.warn(`Department with ID ${id} not found`);
            return res.status(404).json({ message: 'Not Found' });
        }
        res.status(200).json(department);
    } catch (err) {
        console.error('Error fetching department:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const addDepartment = async (req, res) => {
    const { name } = req.body;

    if (!name) {
        console.warn('Invalid department data: Name is required');
        return res.status(400).json({ message: 'Name is required' });
    }

    try {
        const departmentDto = { name };
        const created = await departmentService.add(departmentDto);
        res.status(201).json(created);
    } catch (err) {
        console.warn('Error adding department:', err.message);
        res.status(400).json({ message: err.message });
    }
};

const updateDepartment = async (req, res) => {
    const { id } = req.params;
    const { id: bodyId, name } = req.body;

    if (!id || !bodyId || id !== bodyId) {
        console.warn('ID in URL does not match ID in body');
        return res.status(400).json({ message: 'ID mismatch' });
    }

    try {
        const departmentDto = { id, name };
        await departmentService.update(departmentDto);
        res.sendStatus(204);
    } catch (err) {
        if (err.message === 'Department not found') {
            return res.status(404).json({ message: err.message });
        }
        console.error('Error updating department:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const deleteDepartment = async (req, res) => {
    const { id } = req.params;
    try {
        const success = await departmentService.delete(id);
        if (!success) {
            return res.status(404).json({ message: 'Not Found' });
        }
        res.sendStatus(204);
    } catch (err) {
        console.error('Error deleting department:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    getAllDepartments,
    getDepartmentById,
    addDepartment,
    updateDepartment,
    deleteDepartment
};

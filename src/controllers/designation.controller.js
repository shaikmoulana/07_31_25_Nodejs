const designationService = require('../services/designation.service');

const getAllDesignations = async (req, res) => {
    try {
        console.info('Fetching all designations');
        const data = await designationService.getAll();
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching designations:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getDesignationById = async (req, res) => {
    const { id } = req.params;

    try {
        console.info(`Fetching designation with id: ${id}`);
        const data = await designationService.get(id);

        if (!data) {
            console.warn(`Designation with id ${id} not found`);
            return res.status(404).json({ message: 'Designation not found' });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching designation:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const addDesignation = async (req, res) => {
    const { name } = req.body;

    if (!name) {
        console.warn('Invalid data: Name is required');
        return res.status(400).json({ message: 'Name is required' });
    }

    try {
        const designationDto = { name };
        const created = await designationService.add(designationDto);
        res.status(201).json(created);
    } catch (error) {
        console.warn('Error creating designation:', error.message);
        res.status(400).json({ message: error.message });
    }
};

const updateDesignation = async (req, res) => {
    const { id } = req.params;
    const { id: bodyId, name } = req.body;

    if (!id || !bodyId || id !== bodyId) {
        console.warn(`ID mismatch: URL id (${id}) does not match body id (${bodyId})`);
        return res.status(400).json({ message: 'ID mismatch' });
    }

    try {
        const designationDto = { id, name };
        await designationService.update(designationDto);
        res.sendStatus(204);
    } catch (error) {
        if (error.message === 'Designation not found') {
            return res.status(404).json({ message: error.message });
        }
        console.error('Error updating designation:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const deleteDesignation = async (req, res) => {
    const { id } = req.params;

    try {
        console.info(`Deleting designation with id: ${id}`);
        const success = await designationService.delete(id);

        if (!success) {
            console.warn(`Designation with id ${id} not found`);
            return res.status(404).json({ message: 'Designation not found' });
        }

        res.sendStatus(204);
    } catch (error) {
        console.error('Error deleting designation:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    getAllDesignations,
    getDesignationById,
    addDesignation,
    updateDesignation,
    deleteDesignation
};

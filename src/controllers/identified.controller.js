const identifiedService = require('../services/identified.service');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');

const uploadsDir = path.join(__dirname, '../uploads');

// Ensure uploads folder exists
if (!fsSync.existsSync(uploadsDir)) {
  fsSync.mkdirSync(uploadsDir, { recursive: true });
}

exports.getAll = async (req, res) => {
  try {
    const items = await identifiedService.getAll();
    res.json(items);
  } catch (err) {
    console.error('Error fetching items:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.uploadItem = async (req, res) => {
  try {
    const file = req.file;
    const item = req.body;

    if (!file) return res.status(400).send('File is required');

    const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const filename = `${Date.now()}_${sanitizedFilename}`;
    const filePath = path.join(uploadsDir, filename);

    await fs.writeFile(filePath, file.buffer);

    // Validate item fields here as needed

    item.Photos = filename;
    item.CreatedDate = new Date();

    await identifiedService.addItem(item);

    res.status(201).json({ message: 'Uploaded', file: filename });
  } catch (err) {
    console.error('Error uploading item:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
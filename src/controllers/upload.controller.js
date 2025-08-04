// controllers/upload.controller.js
const path = require('path');
const fs = require('fs');
const { BlobServiceClient } = require('@azure/storage-blob');
const emailService = require('../utils/email.service');
const db = require('../models');
const { Op } = require('sequelize');

// Simple input sanitize helper (escape HTML chars)
const sanitizeInput = (str) => {
  if (typeof str !== 'string') return '';
  return str.replace(/[&<>"'`=\/]/g, s => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '`': '&#x60;',
    '=': '&#x3D;',
    '/': '&#x2F;',
  }[s]));
};

const uploadController = {
  async uploadFile(req, res) {
    try {
      const file = req.file;
      if (!file) 
        return res.status(400).send('Missing file.');

      if (!req.body.item) 
        return res.status(400).send('Missing item data.');

      const item = JSON.parse(req.body.item);

      if (!item.Id) 
        return res.status(400).send('Item.Id is required.');

      // Optional: File type check (example allowing images only)
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return res.status(400).send('Invalid file type. Only JPG, PNG and GIF are allowed.');
      }

      // Optional: File size check (example 5MB max)
      const MAX_SIZE = 5 * 1024 * 1024; // 5MB
      if (file.size > MAX_SIZE) {
        return res.status(400).send('File size exceeds the 5MB limit.');
      }

      // Prepare Azure Blob Storage client
      const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_BLOB_CONNECTION_STRING);
      const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_BLOB_CONTAINER_NAME);
      await containerClient.createIfNotExists();

      // Sanitize original filename for safety
      const sanitizedOrigName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
      const blobName = `${item.Id}${path.extname(sanitizedOrigName)}`;

      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      await blockBlobClient.uploadData(file.buffer, {
        blobHTTPHeaders: { blobContentType: file.mimetype }
      });

      // Ensure uploads directory exists (optional, if you save locally)
      /*
      const uploadsDir = path.join(__dirname, '../uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const filePath = path.join(uploadsDir, blobName);
      await fs.promises.writeFile(filePath, file.buffer);
      */

      // Calculate max QR sequence number for today
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const maxSeq = await db.WareHouseItem.max('QRSequenceNumber', {
        where: db.sequelize.where(db.sequelize.fn('DATE', db.sequelize.col('CreatedDate')), today)
      }) || 0;

      const qrGeneratedAt = new Date();
      const qrSequenceNumber = maxSeq + 1;
      const qrContent = `${item.Id}-${qrGeneratedAt.toLocaleDateString()}-${qrSequenceNumber}`;

      // Sanitize input fields to prevent injection issues
      const safeTags = Array.isArray(item.Tags) ? item.Tags.map(sanitizeInput).join(',') : '';
      const newItemData = {
        Id: item.Id,
        Category: sanitizeInput(item.Category) || 'Unknown',
        CreatedBy: req.user?.UserName || 'Unknown',
        CreatedDate: qrGeneratedAt,
        FilePath: blockBlobClient.url,
        WarehouseLocation: sanitizeInput(item.WarehouseLocation),
        Status: 'Photo Captured',
        Tags: safeTags,
        ItemDescription: sanitizeInput(item.ItemDescription),
        Comments: sanitizeInput(item.Comments),
        IdentifiedLocation: sanitizeInput(item.IdentifiedLocation),
        IdentifiedDate: item.IdentifiedDate ? new Date(item.IdentifiedDate) : null,
        QRSequenceNumber: qrSequenceNumber,
        QRGeneratedAt: qrGeneratedAt,
        QRCodeContent: qrContent,
        Donated: false,
      };

      const newItem = await db.WareHouseItem.create(newItemData);

      // Fetch unique users who reported pending reports on this category
      const reported = await db.Reports.findAll({
        where: { Category: newItem.Category, Status: 'Pending' },
        attributes: ['ReportedBy'],
      });
      const userIds = [...new Set(reported.map(r => r.ReportedBy))];
      const users = await db.Users.findAll({ where: { Id: userIds }, attributes: ['EmailId', 'Name'] });

      // Send notification emails concurrently
      await Promise.all(users.map(user => {
        if (user.EmailId) {
          return emailService.sendItemNotification(user.EmailId, user.Name, newItem.Category);
        }
        return Promise.resolve();
      }));

      // Success response
      res.status(200).json({
        FilePath: newItem.FilePath,
        ItemId: newItem.Id,
        QRGeneratedAt: newItem.QRGeneratedAt,
        QRSequenceNumber: newItem.QRSequenceNumber,
        QRCodeContent: newItem.QRCodeContent,
        Message: 'File uploaded successfully.'
      });

    } catch (err) {
      console.error('Upload error:', err);
      res.status(500).send(`Internal error: ${err.message}`);
    }
  }
};

module.exports = uploadController;

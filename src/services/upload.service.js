// services/upload.service.js
const { BlobServiceClient } = require('@azure/storage-blob');
const path = require('path');
const db = require('../models');

async function uploadFileToBlob(file, fileName) {
  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_BLOB_CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_BLOB_CONTAINER_NAME);
    await containerClient.createIfNotExists();
    const blobClient = containerClient.getBlockBlobClient(fileName);
    await blobClient.uploadData(file.buffer, { blobHTTPHeaders: { blobContentType: file.mimetype } });
    return blobClient.url;
  } catch (error) {
    console.error('Error uploading file to blob:', error);
    throw error;
  }
}


module.exports = {
  uploadFileToBlob
};

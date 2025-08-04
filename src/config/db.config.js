require('dotenv').config();

module.exports = {
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 1433,
  dialect: process.env.DB_DIALECT || 'mssql',
  
  Jwt: {
    Key: process.env.JWT_KEY,
    Issuer: process.env.JWT_ISSUER
  },

  EmailService: {
    connectionString: process.env.AZURE_COMMUNICATION_SERVICES_CONNECTION_STRING,
    senderAddress: '', // add verified sender email here if needed
  },

  AzureBlobStorage: {
    connectionString: process.env.AZURE_BLOB_CONNECTION_STRING,
    containerName: process.env.AZURE_BLOB_CONTAINER_NAME,
  },

  Server: {
    port: process.env.PORT || 5000,
  },

  AllowedHosts: process.env.ALLOWED_HOSTS || '*',
};

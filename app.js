const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config(); // Load environment variables from .env if present

const app = express();

// === Middlewares ===
// Enable CORS for all origins (customize for production if needed)
app.use(cors());

// Parse JSON payloads
app.use(express.json());

// Parse URL-encoded payloads (for form submissions)
app.use(express.urlencoded({ extended: true }));

// HTTP request logger middleware
app.use(morgan('dev'));

// === Routes imports ===
const loginRoutes = require('./routes/login.routes');
const departmentRoutes = require('./routes/department.routes');
const designationRoutes = require('./routes/designation.routes');
const lostItemRoutes = require('./routes/lostItem.routes');
const reportRoutes = require('./routes/reports.routes');
const roleRoutes = require('./routes/role.routes');
const uploadRoutes = require('./routes/upload.routes');

// === API Routes Setup ===
// Prefix routes consistently with '/api'
app.use('/api/login', loginRoutes);
app.use('/api/department', departmentRoutes);
app.use('/api/designation', designationRoutes);
app.use('/api/lostItemRequest', lostItemRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/role', roleRoutes);
app.use('/api', uploadRoutes); // Upload routes generally prefixed at /api

// === Health check or root endpoint ===
app.get('/', (req, res) => {
  res.send('WLIM API is running...');
});

// === 404 Handler for unknown routes ===
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// === Global error handler ===
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ message: 'Something went wrong!' });
});

// === Start server ===
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app; // Export app for testing or further usage if needed

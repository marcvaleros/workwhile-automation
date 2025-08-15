const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

// Import route modules
const healthRoutes = require('./health');
const apiRoutes = require('./api');

// Health check route (always available)
router.use('/health', healthRoutes);

// API routes
router.use('/api', apiRoutes);

// Root route
router.get('/', (req, res) => {
  res.json({
    message: 'WorkWhile Automation Server',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Catch-all for undefined routes
router.use('*', (req, res) => {
  logger.warn(`Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    availableRoutes: [
      '/',
      '/health',
      '/api'
    ]
  });
});

module.exports = router;

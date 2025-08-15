const express = require('express');
const router = express.Router();
const os = require('os');
const logger = require('../utils/logger');

// Basic health check
router.get('/', (req, res) => {
  const healthCheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.version,
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      external: Math.round(process.memoryUsage().external / 1024 / 1024)
    },
    cpu: {
      loadAverage: os.loadavg(),
      cores: os.cpus().length
    }
  };

  logger.info('Health check requested', { ip: req.ip });
  res.status(200).json(healthCheck);
});

// Detailed health check
router.get('/detailed', (req, res) => {
  const detailedHealth = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.version,
    platform: {
      os: os.platform(),
      arch: os.arch(),
      release: os.release(),
      hostname: os.hostname()
    },
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      external: Math.round(process.memoryUsage().external / 1024 / 1024),
      rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
      system: {
        total: Math.round(os.totalmem() / 1024 / 1024 / 1024),
        free: Math.round(os.freemem() / 1024 / 1024 / 1024)
      }
    },
    cpu: {
      loadAverage: os.loadavg(),
      cores: os.cpus().length,
      model: os.cpus()[0]?.model || 'Unknown'
    },
    network: {
      interfaces: Object.keys(os.networkInterfaces()).length
    }
  };

  logger.info('Detailed health check requested', { ip: req.ip });
  res.status(200).json(detailedHealth);
});

// Readiness probe for Kubernetes
router.get('/ready', (req, res) => {
  // Add your readiness logic here
  // For example, check database connections, external services, etc.
  const isReady = true; // Replace with actual readiness check

  if (isReady) {
    logger.info('Readiness check passed', { ip: req.ip });
    res.status(200).json({ status: 'ready' });
  } else {
    logger.warn('Readiness check failed', { ip: req.ip });
    res.status(503).json({ status: 'not ready' });
  }
});

// Liveness probe for Kubernetes
router.get('/live', (req, res) => {
  // Add your liveness logic here
  // This should be lightweight and fast
  const isAlive = true; // Replace with actual liveness check

  if (isAlive) {
    res.status(200).json({ status: 'alive' });
  } else {
    logger.error('Liveness check failed', { ip: req.ip });
    res.status(503).json({ status: 'not alive' });
  }
});

module.exports = router;

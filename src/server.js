require('express-async-errors'); // Handle async errors automatically
const express = require('express');
const http = require('http');
const config = require('./config/config');
const logger = require('./utils/logger');
const routes = require('./routes');
const {
  securityMiddleware,
  corsMiddleware,
  compressionMiddleware,
  rateLimiter,
  requestLogger,
  performanceMonitor,
  errorHandler,
  notFoundHandler
} = require('./middleware');

// Create Express app
const app = express();
const server = http.createServer(app);

// Trust proxy for proper IP handling behind load balancers
app.set('trust proxy', 1);

// Body parsing middleware
app.use(express.json({
  limit: '10mb',
  verify: (req, res, buf) => {
    req.rawBody = buf; // Store raw body for webhook verification if needed
  }
}));
app.use(express.urlencoded({
  extended: true,
  limit: '10mb'
}));

// Security middleware (order matters!)
app.use(securityMiddleware);
app.use(corsMiddleware);

// Performance middleware
app.use(compressionMiddleware);
app.use(performanceMonitor);

// Rate limiting (apply to all routes)
app.use(rateLimiter);

// Request logging
app.use(requestLogger);

// Health check endpoint (before main routes for load balancer access)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Main routes
app.use('/', routes);

// 404 handler (must be after all routes)
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);

  server.close((err) => {
    if (err) {
      logger.error('Error during server shutdown:', err);
      process.exit(1);
    }

    logger.info('Server closed successfully');
    process.exit(0);
  });

  // Force shutdown after 30 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 30000);
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start server
const startServer = async () => {
  try {
    await new Promise((resolve, reject) => {
      server.listen(config.server.port, config.server.host, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });

    logger.info('🚀 Server started successfully!', {
      environment: config.server.env,
      port: config.server.port,
      host: config.server.host,
      nodeVersion: process.version,
      pid: process.pid
    });

    // Log server info
    logger.info('📊 Server Information:', {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      platform: process.platform,
      arch: process.arch
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

module.exports = { app, server };

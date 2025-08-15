const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const config = require('../config/config');
const logger = require('../utils/logger');

// Custom morgan token for response time
morgan.token('response-time', (req, res) => {
  if (!res._header || !req._startAt) return '';
  const diff = process.hrtime(req._startAt);
  const ms = diff[0] * 1e3 + diff[1] * 1e-6;
  return ms.toFixed(3);
});

// Custom morgan format
const morganFormat = config.server.isDevelopment
  ? ':method :url :status :response-time ms - :res[content-length]'
  : 'combined';

// Rate limiting middleware
const rateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil(config.rateLimit.windowMs / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: Math.ceil(config.rateLimit.windowMs / 1000)
    });
  }
});

// Security middleware
const securityMiddleware = helmet({
  contentSecurityPolicy: config.performance.helmet.contentSecurityPolicy,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
});

// CORS middleware
const corsMiddleware = cors({
  origin: config.security.cors.origin,
  credentials: config.security.cors.credentials,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count']
});

// Compression middleware
const compressionMiddleware = compression({
  level: config.performance.compression.level,
  threshold: config.performance.compression.threshold,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
});

// Request logging middleware
const requestLogger = morgan(morganFormat, {
  stream: {
    write: (message) => logger.info(message.trim())
  }
});

// Performance monitoring middleware
const performanceMonitor = (req, res, next) => {
  req._startAt = process.hrtime();

  res.on('finish', () => {
    const diff = process.hrtime(req._startAt);
    const ms = diff[0] * 1e3 + diff[1] * 1e-6;

    if (ms > 1000) { // Log slow requests (>1s)
      logger.warn(`Slow request detected: ${req.method} ${req.url} - ${ms.toFixed(2)}ms`);
    }
  });

  next();
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  logger.error('Unhandled error:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  });

  // Don't leak error details in production
  const errorResponse = config.server.isProduction
    ? { error: 'Internal server error' }
    : { error: err.message, stack: err.stack };

  res.status(err.status || 500).json(errorResponse);
};

// 404 handler
const notFoundHandler = (req, res) => {
  logger.warn(`Route not found: ${req.method} ${req.url}`);
  res.status(404).json({
    error: 'Route not found',
    path: req.url,
    method: req.method
  });
};

module.exports = {
  securityMiddleware,
  corsMiddleware,
  compressionMiddleware,
  rateLimiter,
  requestLogger,
  performanceMonitor,
  errorHandler,
  notFoundHandler
};

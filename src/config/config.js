const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const config = {
  // Server Configuration
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    env: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development'
  },

  // Security Configuration
  security: {
    jwtSecret: process.env.JWT_SECRET || 'fallback-secret-key-change-in-production',
    sessionSecret: process.env.SESSION_SECRET || 'fallback-session-secret',
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: process.env.CORS_CREDENTIALS === 'true'
    }
  },

  // Rate Limiting Configuration
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    filePath: process.env.LOG_FILE_PATH || 'logs/'
  },

  // Performance Configuration
  performance: {
    compression: {
      level: 6, // Optimal compression level
      threshold: 1024 // Only compress responses > 1KB
    },
    helmet: {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"]
        }
      }
    }
  }
};

module.exports = config;

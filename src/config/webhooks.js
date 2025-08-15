/**
 * Webhook Configuration
 * Configuration for various webhook endpoints including OpenPhone
 */

module.exports = {
  openphone: {
    // Webhook endpoint path
    endpoint: '/api/webhooks/openphone',

    // Supported event types
    supportedEvents: [
      'message.received',
      'message.sent',
      'call.started',
      'call.ended',
      'contact.created',
      'contact.updated'
    ],

    // Security settings
    security: {
      // Enable webhook signature verification (if OpenPhone provides this)
      verifySignature: false,

      // Allowed IP ranges (optional - restrict to OpenPhone's IPs if known)
      allowedIPs: [],

      // Rate limiting for webhook endpoint
      rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 1000 // limit each IP to 1000 requests per windowMs
      }
    },

    // Webhook processing settings
    processing: {
      // Maximum payload size (in bytes)
      maxPayloadSize: 1024 * 1024, // 1MB

      // Timeout for webhook processing (in ms)
      timeout: 30000, // 30 seconds

      // Retry settings for failed webhook processing
      retry: {
        enabled: true,
        maxAttempts: 3,
        delayMs: 1000
      }
    },

    // Logging settings
    logging: {
      // Log all webhook payloads (be careful with sensitive data)
      logPayload: true,

      // Log level for webhook events
      level: 'info',

      // Mask sensitive fields in logs
      maskFields: ['password', 'token', 'secret', 'key']
    }
  },

  // Global webhook settings
  global: {
    // Enable/disable all webhooks
    enabled: true,

    // Default response timeout
    responseTimeout: 5000, // 5 seconds

    // Health check endpoint for webhook status
    healthCheck: '/api/webhooks/health'
  }
};

const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const webhookHandler = require('../utils/webhookHandler');

// Import specific API route modules
// const userRoutes = require('./api/users');
// const automationRoutes = require('./api/automation');
// const taskRoutes = require('./api/tasks');

// API versioning middleware
router.use((req, res, next) => {
  req.apiVersion = 'v1';
  next();
});

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'WorkWhile Automation API',
    version: req.apiVersion,
    status: 'active',
    timestamp: new Date().toISOString(),
    endpoints: {
      info: 'GET /api',
      health: 'GET /health',
      webhook: 'POST /api/webhooks/openphone',
      // Add more endpoints as they're created
    }
  });
});

// Example endpoint for demonstration
router.get('/status', (req, res) => {
  logger.info('API status requested', { ip: req.ip, userAgent: req.get('User-Agent') });

  res.json({
    status: 'operational',
    services: {
      api: 'healthy',
      database: 'healthy', // Replace with actual health checks
      external: 'healthy'  // Replace with actual health checks
    },
    lastChecked: new Date().toISOString()
  });
});

// Example POST endpoint with validation
router.post('/echo', (req, res) => {
  const { message, timestamp } = req.body;

  if (!message) {
    return res.status(400).json({
      error: 'Message is required',
      received: req.body
    });
  }

  logger.info('Echo request received', {
    ip: req.ip,
    message: message.substring(0, 100) // Log first 100 chars only
  });

  res.json({
    echo: message,
    timestamp: timestamp || new Date().toISOString(),
    receivedAt: new Date().toISOString()
  });
});


// OpenPhone Webhook Endpoint
router.post('/webhooks/openphone', async (req, res) => {
  try {
    // Immediate console logging for debugging
    console.log('=== OpenPhone Webhook Received ===');
    console.log('Headers:', req.headers);
    console.log('Body:', JSON.stringify(req.body, null, 2));
    console.log('IP:', req.ip);
    console.log('===============================');

    // Log the incoming webhook
    logger.info('OpenPhone webhook received', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      contentType: req.get('Content-Type'),
      bodySize: JSON.stringify(req.body).length
    });

    // Validate webhook payload structure
    const { id, object, apiVersion, createdAt, type: eventType, data } = req.body;

    console.log('Extracted fields:', { id, eventType, hasData: !!data, hasDataObject: !!(data && data.object) });

    if (!eventType || !data || !data.object) {
      console.log('Validation failed - missing required fields');
      logger.warn('OpenPhone webhook missing required fields', { body: req.body });
      return res.status(400).json({
        error: 'Missing required fields: event type or data object',
        received: req.body
      });
    }

    // Extract call-specific data for call events
    let callData = null;
    if (eventType.startsWith('call.')) {
      const call = data.object;
      callData = {
        callId: call.id,
        from: call.from,
        to: call.to,
        direction: call.direction,
        status: call.status,
        createdAt: call.createdAt,
        answeredAt: call.answeredAt,
        completedAt: call.completedAt,
        userId: call.userId,
        phoneNumberId: call.phoneNumberId,
        conversationId: call.conversationId,
        voicemail: call.voicemail || null,
        media: call.media || []
      };
      console.log('Call data extracted:', callData);
    }

    console.log('About to process webhook with webhookHandler...');

    // Process the webhook event
    const result = await webhookHandler.processOpenPhoneEvent(data, eventType);

    console.log('Webhook processed successfully, result:', result);

    // Respond with success
    res.status(200).json({
      status: 'success',
      message: 'Webhook processed successfully',
      eventId: id,
      eventType,
      eventCreatedAt: createdAt,
      callData,
      result,
      processedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in webhook processing:', error);
    console.error('Error stack:', error.stack);

    logger.error('Error processing OpenPhone webhook', {
      error: error.message,
      stack: error.stack,
      body: req.body
    });

    res.status(500).json({
      error: 'Internal server error processing webhook',
      timestamp: new Date().toISOString()
    });
  }
});



// Mount specific API route modules
// router.use('/users', userRoutes);
// router.use('/automation', automationRoutes);
// router.use('/tasks', taskRoutes);

// API 404 handler
router.use('*', (req, res) => {
  logger.warn(`API route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: 'API endpoint not found',
    path: req.originalUrl,
    method: req.method,
    availableEndpoints: [
      'GET /api',
      'GET /api/status',
      'POST /api/echo',
      'POST /api/webhooks/openphone'
    ]
  });
});

module.exports = router;

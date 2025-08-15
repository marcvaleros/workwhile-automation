/**
 * Webhook Tests
 * Tests for OpenPhone webhook functionality
 */

const request = require('supertest');
const express = require('express');
const webhookHandler = require('../utils/webhookHandler');

// Mock logger for testing
jest.mock('../utils/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
}));

describe('OpenPhone Webhook Tests', () => {
  let app;
  let server;

  beforeAll(() => {
    // Create test app
    app = express();
    app.use(express.json());

    // Add webhook route
    app.post('/api/webhooks/openphone', async (req, res) => {
      try {
        const { event_type, data } = req.body;

        if (!event_type) {
          return res.status(400).json({
            error: 'Missing required field: event_type',
            received: req.body
          });
        }

        const result = await webhookHandler.processOpenPhoneEvent(data, event_type);

        res.status(200).json({
          status: 'success',
          message: 'Webhook processed successfully',
          eventType: event_type,
          result,
          processedAt: new Date().toISOString()
        });

      } catch (error) {
        res.status(500).json({
          error: 'Internal server error processing webhook',
          timestamp: new Date().toISOString()
        });
      }
    });

    server = app.listen(0); // Use random port
  });

  afterAll((done) => {
    server.close(done);
  });

  describe('POST /api/webhooks/openphone', () => {
    it('should process message.received event successfully', async () => {
      const payload = {
        event_type: 'message.received',
        data: {
          id: 'msg_123456',
          from: '+1234567890',
          to: '+0987654321',
          body: 'Hello, this is a test message',
          timestamp: '2024-01-01T12:00:00Z'
        }
      };

      const response = await request(app)
        .post('/api/webhooks/openphone')
        .send(payload)
        .expect(200);

      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty('eventType', 'message.received');
      expect(response.body).toHaveProperty('result');
      expect(response.body.result).toHaveProperty('status', 'processed');
    });

    it('should process message.sent event successfully', async () => {
      const payload = {
        event_type: 'message.sent',
        data: {
          id: 'msg_123456',
          from: '+0987654321',
          to: '+1234567890',
          status: 'delivered',
          timestamp: '2024-01-01T12:00:00Z'
        }
      };

      const response = await request(app)
        .post('/api/webhooks/openphone')
        .send(payload)
        .expect(200);

      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty('eventType', 'message.sent');
      expect(response.body).toHaveProperty('result');
      expect(response.body.result).toHaveProperty('status', 'processed');
    });

    it('should process call.started event successfully', async () => {
      const payload = {
        event_type: 'call.started',
        data: {
          id: 'call_123456',
          from: '+1234567890',
          to: '+0987654321',
          direction: 'inbound',
          timestamp: '2024-01-01T12:00:00Z'
        }
      };

      const response = await request(app)
        .post('/api/webhooks/openphone')
        .send(payload)
        .expect(200);

      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty('eventType', 'call.started');
      expect(response.body).toHaveProperty('result');
      expect(response.body.result).toHaveProperty('status', 'processed');
    });

    it('should process call.ended event successfully', async () => {
      const payload = {
        event_type: 'call.ended',
        data: {
          id: 'call_123456',
          duration: 120,
          status: 'completed',
          timestamp: '2024-01-01T12:02:00Z'
        }
      };

      const response = await request(app)
        .post('/api/webhooks/openphone')
        .send(payload)
        .expect(200);

      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty('eventType', 'call.ended');
      expect(response.body).toHaveProperty('result');
      expect(response.body.result).toHaveProperty('status', 'processed');
    });

    it('should process contact.created event successfully', async () => {
      const payload = {
        event_type: 'contact.created',
        data: {
          id: 'contact_123456',
          name: 'John Doe',
          phone: '+1234567890',
          timestamp: '2024-01-01T12:00:00Z'
        }
      };

      const response = await request(app)
        .post('/api/webhooks/openphone')
        .send(payload)
        .expect(200);

      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty('eventType', 'contact.created');
      expect(response.body).toHaveProperty('result');
      expect(response.body.result).toHaveProperty('status', 'processed');
    });

    it('should process contact.updated event successfully', async () => {
      const payload = {
        event_type: 'contact.updated',
        data: {
          id: 'contact_123456',
          changes: {
            name: 'John Smith',
            email: 'john.smith@example.com'
          },
          timestamp: '2024-01-01T12:00:00Z'
        }
      };

      const response = await request(app)
        .post('/api/webhooks/openphone')
        .send(payload)
        .expect(200);

      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty('eventType', 'contact.updated');
      expect(response.body).toHaveProperty('result');
      expect(response.body.result).toHaveProperty('status', 'processed');
    });

    it('should return 400 for missing event_type', async () => {
      const payload = {
        data: {
          id: 'test_123',
          message: 'Test message'
        }
      };

      const response = await request(app)
        .post('/api/webhooks/openphone')
        .send(payload)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Missing required field: event_type');
      expect(response.body).toHaveProperty('received');
    });

    it('should handle unknown event types gracefully', async () => {
      const payload = {
        event_type: 'unknown.event',
        data: {
          id: 'test_123',
          message: 'Test message'
        }
      };

      const response = await request(app)
        .post('/api/webhooks/openphone')
        .send(payload)
        .expect(200);

      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty('eventType', 'unknown.event');
      expect(response.body).toHaveProperty('result');
      expect(response.body.result).toHaveProperty('status', 'unhandled');
    });

    it('should handle malformed data gracefully', async () => {
      const payload = {
        event_type: 'message.received',
        data: null
      };

      const response = await request(app)
        .post('/api/webhooks/openphone')
        .send(payload)
        .expect(500);

      expect(response.body).toHaveProperty('error', 'Internal server error processing webhook');
    });
  });

  describe('WebhookHandler', () => {
    it('should validate event data correctly', () => {
      const validData = {
        id: 'test_123',
        from: '+1234567890',
        to: '+0987654321',
        body: 'Test message'
      };

      const isValid = webhookHandler.validateEventData(validData, 'message.received');
      expect(isValid).toBe(true);
    });

    it('should reject invalid event data', () => {
      const invalidData = {
        from: '+1234567890',
        to: '+0987654321'
        // Missing required 'id' field
      };

      const isValid = webhookHandler.validateEventData(invalidData, 'message.received');
      expect(isValid).toBe(false);
    });

    it('should mask sensitive data in logs', () => {
      const phoneNumber = '+1234567890';
      const masked = webhookHandler.maskSensitiveData(phoneNumber);

      expect(masked).toContain('*');
      expect(masked).not.toBe(phoneNumber);
      expect(masked.length).toBe(phoneNumber.length);
    });
  });
});

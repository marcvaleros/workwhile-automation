/**
 * Webhook Handler Utility
 * Handles processing of various webhook events including OpenPhone
 */

const logger = require('./logger');
const webhookConfig = require('../config/webhooks');

class WebhookHandler {
  constructor() {
    this.config = webhookConfig.openphone;
  }

  /**
   * Process OpenPhone webhook event
   * @param {Object} eventData - The webhook event data
   * @param {string} eventType - The type of event
   * @returns {Promise<Object>} - Processing result
   */
  async processOpenPhoneEvent(eventData, eventType) {
    try {
      logger.info(`Processing OpenPhone ${eventType} event`, {
        eventType,
        eventId: eventData.id,
        timestamp: new Date().toISOString()
      });

      // Validate event data
      if (!this.validateEventData(eventData, eventType)) {
        throw new Error(`Invalid event data for ${eventType}`);
      }

      // Process based on event type
      let result;
      switch (eventType) {
      case 'message.received':
        result = await this.handleMessageReceived(eventData);
        break;
      case 'message.sent':
        result = await this.handleMessageSent(eventData);
        break;
      case 'call.started':
        result = await this.handleCallStarted(eventData);
        break;
      case 'call.ended':
        result = await this.handleCallEnded(eventData);
        break;
      case 'contact.created':
        result = await this.handleContactCreated(eventData);
        break;
      case 'contact.updated':
        result = await this.handleContactUpdated(eventData);
        break;
      default:
        logger.warn(`Unhandled OpenPhone event type: ${eventType}`);
        result = { status: 'unhandled', eventType };
      }

      logger.info(`Successfully processed ${eventType} event`, {
        eventType,
        eventId: eventData.id,
        result
      });

      return result;

    } catch (error) {
      logger.error(`Error processing OpenPhone ${eventType} event`, {
        error: error.message,
        eventType,
        eventId: eventData.id,
        stack: error.stack
      });
      throw error;
    }
  }

  /**
   * Validate event data structure
   * @param {Object} eventData - Event data to validate
   * @param {string} eventType - Type of event
   * @returns {boolean} - Whether data is valid
   */
  validateEventData(eventData, eventType) {
    if (!eventData || typeof eventData !== 'object') {
      return false;
    }

    // Basic validation for common fields
    const requiredFields = ['id'];

    switch (eventType) {
    case 'message.received':
      requiredFields.push('from', 'to', 'body');
      break;
    case 'message.sent':
      requiredFields.push('from', 'to');
      break;
    case 'call.started':
      requiredFields.push('from', 'to', 'direction');
      break;
    case 'call.ended':
      // call.ended might not have from/to/direction, just duration and status
      break;
    case 'contact.created':
      requiredFields.push('name', 'phone');
      break;
    case 'contact.updated':
      // contact.updated might have changes object instead of direct fields
      break;
    }

    return requiredFields.every(field => Object.prototype.hasOwnProperty.call(eventData, field));
  }

  /**
   * Handle message received event
   * @param {Object} data - Message data
   * @returns {Promise<Object>} - Processing result
   */
  async handleMessageReceived(data) {
    logger.info('Processing message received event', {
      messageId: data.id,
      from: data.from,
      to: data.to,
      body: this.maskSensitiveData(data.body),
      timestamp: data.timestamp
    });

    // TODO: Implement your business logic here
    // Examples:
    // - Store message in database
    // - Trigger automation workflows
    // - Send notifications
    // - Update contact information
    // - Route message to appropriate team member

    // Simulate async processing
    await this.simulateProcessing();

    return {
      status: 'processed',
      action: 'message_stored',
      messageId: data.id,
      processedAt: new Date().toISOString()
    };
  }

  /**
   * Handle message sent event
   * @param {Object} data - Message data
   * @returns {Promise<Object>} - Processing result
   */
  async handleMessageSent(data) {
    logger.info('Processing message sent event', {
      messageId: data.id,
      from: data.from,
      to: data.to,
      status: data.status,
      timestamp: data.timestamp
    });

    // TODO: Implement your business logic here
    // Examples:
    // - Update message status in database
    // - Log delivery confirmation
    // - Trigger follow-up actions

    await this.simulateProcessing();

    return {
      status: 'processed',
      action: 'status_updated',
      messageId: data.id,
      processedAt: new Date().toISOString()
    };
  }

  /**
   * Handle call started event
   * @param {Object} data - Call data
   * @returns {Promise<Object>} - Processing result
   */
  async handleCallStarted(data) {
    logger.info('Processing call started event', {
      callId: data.id,
      from: data.from,
      to: data.to,
      direction: data.direction,
      timestamp: data.timestamp
    });

    // TODO: Implement your business logic here
    // Examples:
    // - Log call start
    // - Update contact status
    // - Prepare call recording setup

    await this.simulateProcessing();

    return {
      status: 'processed',
      action: 'call_logged',
      callId: data.id,
      processedAt: new Date().toISOString()
    };
  }

  /**
   * Handle call ended event
   * @param {Object} data - Call data
   * @returns {Promise<Object>} - Processing result
   */
  async handleCallEnded(data) {
    logger.info('Processing call ended event', {
      callId: data.id,
      duration: data.duration,
      status: data.status,
      timestamp: data.timestamp
    });

    // TODO: Implement your business logic here
    // Examples:
    // - Update call record with duration
    // - Process call recording
    // - Trigger follow-up actions

    await this.simulateProcessing();

    return {
      status: 'processed',
      action: 'call_completed',
      callId: data.id,
      processedAt: new Date().toISOString()
    };
  }

  /**
   * Handle contact created event
   * @param {Object} data - Contact data
   * @returns {Promise<Object>} - Processing result
   */
  async handleContactCreated(data) {
    logger.info('Processing contact created event', {
      contactId: data.id,
      name: data.name,
      phone: this.maskSensitiveData(data.phone),
      timestamp: data.timestamp
    });

    // TODO: Implement your business logic here
    // Examples:
    // - Store contact in database
    // - Add to CRM system
    // - Send welcome message

    await this.simulateProcessing();

    return {
      status: 'processed',
      action: 'contact_stored',
      contactId: data.id,
      processedAt: new Date().toISOString()
    };
  }

  /**
   * Handle contact updated event
   * @param {Object} data - Contact data
   * @returns {Promise<Object>} - Processing result
   */
  async handleContactUpdated(data) {
    logger.info('Processing contact updated event', {
      contactId: data.id,
      updatedFields: Object.keys(data.changes || {}),
      timestamp: data.timestamp
    });

    // TODO: Implement your business logic here
    // Examples:
    // - Update contact in database
    // - Sync with CRM system
    // - Trigger relevant automations

    await this.simulateProcessing();

    return {
      status: 'processed',
      action: 'contact_updated',
      contactId: data.id,
      processedAt: new Date().toISOString()
    };
  }

  /**
   * Mask sensitive data in logs
   * @param {string} data - Data to mask
   * @returns {string} - Masked data
   */
  maskSensitiveData(data) {
    if (!data || typeof data !== 'string') {
      return data;
    }

    // Simple masking - replace middle characters with asterisks
    if (data.length > 4) {
      return data.substring(0, 2) + '*'.repeat(data.length - 4) + data.substring(data.length - 2);
    }

    return '*'.repeat(data.length);
  }

  /**
   * Simulate async processing (remove in production)
   * @returns {Promise<void>}
   */
  async simulateProcessing() {
    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

module.exports = new WebhookHandler();

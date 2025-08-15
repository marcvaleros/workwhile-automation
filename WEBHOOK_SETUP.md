# OpenPhone Webhook Integration

This document describes how to set up and use the OpenPhone webhook integration for the WorkWhile Automation server.

## Overview

The OpenPhone webhook endpoint allows you to receive real-time notifications about various events happening in your OpenPhone account, such as:

- **Messages**: Received and sent SMS messages
- **Calls**: Call start/end events with duration and status
- **Contacts**: Contact creation and updates

## Endpoint Details

- **URL**: `POST /api/webhooks/openphone`
- **Content-Type**: `application/json`
- **Authentication**: Currently none (consider adding webhook signature verification)

## Supported Event Types

### 1. Message Events

#### `message.received`
Triggered when a new message is received.

**Payload Structure:**
```json
{
  "event_type": "message.received",
  "data": {
    "id": "msg_123456",
    "from": "+1234567890",
    "to": "+0987654321",
    "body": "Hello, this is a test message",
    "timestamp": "2024-01-01T12:00:00Z"
  }
}
```

#### `message.sent`
Triggered when a message is sent and its status changes.

**Payload Structure:**
```json
{
  "event_type": "message.sent",
  "data": {
    "id": "msg_123456",
    "from": "+0987654321",
    "to": "+1234567890",
    "status": "delivered",
    "timestamp": "2024-01-01T12:00:00Z"
  }
}
```

### 2. Call Events

#### `call.started`
Triggered when a call begins.

**Payload Structure:**
```json
{
  "event_type": "call.started",
  "data": {
    "id": "call_123456",
    "from": "+1234567890",
    "to": "+0987654321",
    "direction": "inbound",
    "timestamp": "2024-01-01T12:00:00Z"
  }
}
```

#### `call.ended`
Triggered when a call ends.

**Payload Structure:**
```json
{
  "event_type": "call.ended",
  "data": {
    "id": "call_123456",
    "duration": 120,
    "status": "completed",
    "timestamp": "2024-01-01T12:02:00Z"
  }
}
```

### 3. Contact Events

#### `contact.created`
Triggered when a new contact is created.

**Payload Structure:**
```json
{
  "event_type": "contact.created",
  "data": {
    "id": "contact_123456",
    "name": "John Doe",
    "phone": "+1234567890",
    "timestamp": "2024-01-01T12:00:00Z"
  }
}
```

#### `contact.updated`
Triggered when a contact is updated.

**Payload Structure:**
```json
{
  "event_type": "contact.updated",
  "data": {
    "id": "contact_123456",
    "changes": {
      "name": "John Smith",
      "email": "john.smith@example.com"
    },
    "timestamp": "2024-01-01T12:00:00Z"
  }
}
```

## Setup Instructions

### 1. Configure OpenPhone Webhook

1. Log into your OpenPhone account
2. Navigate to Settings → Integrations → Webhooks
3. Add a new webhook with the following details:
   - **URL**: `https://yourdomain.com/api/webhooks/openphone`
   - **Events**: Select the events you want to receive
   - **Method**: POST
   - **Content Type**: application/json

### 2. Environment Configuration

Add the following environment variables to your `.env` file:

```bash
# OpenPhone Webhook Configuration
OPENPHONE_WEBHOOK_SECRET=your_webhook_secret_here
OPENPHONE_WEBHOOK_ENABLED=true
OPENPHONE_WEBHOOK_TIMEOUT=30000
```

### 3. Server Configuration

The webhook endpoint is automatically available when you start the server. You can verify it's working by:

1. Starting your server: `npm start`
2. Checking the API info endpoint: `GET /api`
3. Looking for the webhook endpoint in the response

## Security Considerations

### 1. Webhook Signature Verification

Currently, webhook signature verification is disabled. To enable it:

1. Update `src/config/webhooks.js`
2. Set `verifySignature: true`
3. Implement signature verification in the webhook handler

### 2. IP Restriction

You can restrict webhook access to specific IP addresses:

1. Update `src/config/webhooks.js`
2. Add OpenPhone's IP addresses to `allowedIPs` array

### 3. Rate Limiting

Rate limiting is configured to prevent abuse:

- **Window**: 15 minutes
- **Max Requests**: 1000 per IP address

## Customization

### 1. Adding New Event Types

To handle new event types:

1. Add the event type to `supportedEvents` in `src/config/webhooks.js`
2. Create a new handler method in `src/utils/webhookHandler.js`
3. Add the case to the switch statement in `processOpenPhoneEvent`

### 2. Business Logic Implementation

Each event handler contains TODO comments where you can implement your business logic:

- **Database Operations**: Store events, update records
- **Automation Triggers**: Start workflows, send notifications
- **External Integrations**: Sync with CRM, send alerts
- **Analytics**: Track metrics, generate reports

### 3. Error Handling

The webhook handler includes comprehensive error handling:

- Input validation
- Async processing with timeouts
- Detailed logging for debugging
- Graceful error responses

## Testing

### 1. Local Testing

Use tools like ngrok to test webhooks locally:

```bash
# Install ngrok
npm install -g ngrok

# Start your server
npm start

# In another terminal, expose your local server
ngrok http 3000

# Use the ngrok URL in OpenPhone webhook configuration
```

### 2. Test Payloads

You can test the webhook with sample payloads:

```bash
curl -X POST http://localhost:3000/api/webhooks/openphone \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "message.received",
    "data": {
      "id": "test_123",
      "from": "+1234567890",
      "to": "+0987654321",
      "body": "Test message",
      "timestamp": "2024-01-01T12:00:00Z"
    }
  }'
```

## Monitoring and Logging

### 1. Log Files

All webhook events are logged to your configured logging system with:

- Event type and ID
- Processing results
- Error details
- Performance metrics

### 2. Health Checks

Monitor webhook health via:

- `GET /api/status` - General API status
- `GET /health` - Server health
- Log analysis for webhook processing

### 3. Metrics

Track webhook performance:

- Processing time
- Success/failure rates
- Event volume by type
- Error patterns

## Troubleshooting

### Common Issues

1. **Webhook not receiving events**
   - Check server is running and accessible
   - Verify OpenPhone webhook configuration
   - Check firewall/network settings

2. **Events not processing**
   - Review server logs for errors
   - Verify event payload structure
   - Check business logic implementation

3. **Performance issues**
   - Monitor processing times
   - Check database performance
   - Review external API calls

### Debug Mode

Enable detailed logging by setting log level to 'debug' in your logger configuration.

## Support

For issues or questions:

1. Check the server logs
2. Review this documentation
3. Test with sample payloads
4. Verify OpenPhone webhook configuration

## Future Enhancements

Planned improvements:

- [ ] Webhook signature verification
- [ ] Retry mechanism for failed processing
- [ ] Webhook event queuing
- [ ] Real-time webhook status dashboard
- [ ] Webhook event filtering
- [ ] Integration with other communication platforms

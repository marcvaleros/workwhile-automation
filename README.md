# WorkWhile Automation Server

A production-ready, optimized Node.js server built with Express.js, featuring enterprise-grade security, performance optimizations, and comprehensive monitoring.

## 🚀 Features

- **Security First**: Helmet.js, CORS, rate limiting, input validation
- **Performance Optimized**: Compression, response caching, performance monitoring
- **Production Ready**: Comprehensive logging, error handling, graceful shutdown
- **Monitoring**: Health checks, metrics, Kubernetes probes
- **Developer Experience**: ESLint, Jest testing, hot reloading
- **Scalable Architecture**: Modular routing, middleware composition

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher
- Windows 10/11 (tested on Windows 10.0.26100)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd workwhile-automation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment template
   copy env.example .env
   
   # Edit .env with your configuration
   notepad .env
   ```

4. **Start the server**
   ```bash
   # Development mode with hot reload
   npm run dev
   
   # Production mode
   npm start
   ```

## 🔧 Configuration

The server uses environment variables for configuration. Key settings:

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | Environment (development/production) |
| `PORT` | `3000` | Server port |
| `HOST` | `localhost` | Server host |
| `JWT_SECRET` | `fallback-secret` | JWT signing secret |
| `RATE_LIMIT_MAX_REQUESTS` | `100` | Max requests per window |
| `LOG_LEVEL` | `info` | Logging level |

## 📡 API Endpoints

### Health Checks
- `GET /health` - Basic health status
- `GET /health/detailed` - Detailed system information
- `GET /health/ready` - Kubernetes readiness probe
- `GET /health/live` - Kubernetes liveness probe

### API Routes
- `GET /api` - API information
- `GET /api/status` - Service status
- `POST /api/echo` - Echo endpoint (example)

### Root
- `GET /` - Server information

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

## 📊 Monitoring & Logging

- **Logs**: Stored in `logs/` directory
- **Health Checks**: Available at `/health` endpoints
- **Performance**: Response time monitoring
- **Errors**: Comprehensive error logging with stack traces

## 🔒 Security Features

- **Helmet.js**: Security headers and CSP
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: DDoS protection
- **Input Validation**: Request body validation
- **HTTPS Ready**: Configured for production HTTPS

## 🚀 Performance Optimizations

- **Compression**: Gzip compression for responses
- **Response Caching**: Configurable caching strategies
- **Memory Management**: Optimized memory usage
- **Async Operations**: Non-blocking I/O

## 🏗️ Project Structure

```
workwhile-automation/
├── src/
│   ├── config/          # Configuration files
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   ├── test/            # Test files
│   └── server.js        # Main server file
├── logs/                # Log files (auto-created)
├── .eslintrc.js         # ESLint configuration
├── jest.config.js       # Jest configuration
├── package.json         # Dependencies and scripts
└── README.md            # This file
```

## 🐳 Docker Support

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 📈 Production Deployment

1. **Environment Variables**: Set production values
2. **Process Manager**: Use PM2 or similar
3. **Reverse Proxy**: Nginx/Apache for SSL termination
4. **Monitoring**: Integrate with monitoring services
5. **Logs**: Configure log aggregation

## 🔧 Development

### Adding New Routes
1. Create route file in `src/routes/api/`
2. Import in `src/routes/api.js`
3. Add to available endpoints list

### Adding Middleware
1. Create middleware in `src/middleware/`
2. Import in `src/middleware/index.js`
3. Apply in `src/server.js`

### Environment Variables
1. Add to `env.example`
2. Update `src/config/config.js`
3. Document in README

## 🐛 Troubleshooting

### Common Issues

**Port already in use**
```bash
# Find process using port
netstat -ano | findstr :3000
# Kill process
taskkill /PID <PID> /F
```

**Permission denied**
```bash
# Run as administrator or check file permissions
```

**Module not found**
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Add tests
5. Submit pull request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ for WorkWhile Automation**

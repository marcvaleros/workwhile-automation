// Test setup file for Jest
process.env.NODE_ENV = 'test';

// Global test utilities
global.testUtils = {
  // Mock request object
  mockRequest: (overrides = {}) => ({
    method: 'GET',
    url: '/test',
    originalUrl: '/test',
    path: '/test',
    headers: {},
    body: {},
    query: {},
    params: {},
    ip: '127.0.0.1',
    get: jest.fn(),
    ...overrides
  }),

  // Mock response object
  mockResponse: () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    res.end = jest.fn().mockReturnValue(res);
    res.setHeader = jest.fn().mockReturnValue(res);
    res.getHeader = jest.fn().mockReturnValue('test-header');
    res._getStatusCode = jest.fn().mockReturnValue(200);
    res._getHeaders = jest.fn().mockReturnValue({});
    return res;
  },

  // Mock next function
  mockNext: jest.fn(),

  // Wait for async operations
  wait: (ms) => new Promise(resolve => setTimeout(resolve, ms))
};

// Suppress console logs during tests unless explicitly needed
if (process.env.NODE_ENV === 'test') {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
}

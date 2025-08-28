const rateLimit = require('express-rate-limit');

// Rate limiting middleware
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs: windowMs,
    max: max,
    message: {
      error: 'Too many requests',
      message: message,
      timestamp: new Date().toISOString()
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        error: 'Too many requests',
        message: message,
        retryAfter: Math.ceil(windowMs / 1000),
        timestamp: new Date().toISOString()
      });
    }
  });
};

// General API rate limiter
const apiLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests per 15 minutes
  'Too many API requests, please try again later'
);

// Strict rate limiter for sentiment analysis
const sentimentAnalysisLimiter = createRateLimiter(
  60 * 1000, // 1 minute
  20, // 20 requests per minute
  'Too many sentiment analysis requests, please slow down'
);

// Batch analysis rate limiter (more restrictive)
const batchAnalysisLimiter = createRateLimiter(
  5 * 60 * 1000, // 5 minutes
  10, // 10 batch requests per 5 minutes
  'Too many batch analysis requests, please wait before trying again'
);

// Input sanitization middleware
const sanitizeInput = (req, res, next) => {
  try {
    // Sanitize text inputs
    if (req.body.text) {
      req.body.text = req.body.text.trim().replace(/[<>]/g, '');
    }
    
    if (req.body.texts && Array.isArray(req.body.texts)) {
      req.body.texts = req.body.texts.map(text => 
        text.trim().replace(/[<>]/g, '')
      );
    }

    // Sanitize other string inputs
    if (req.body.context) {
      req.body.context = req.body.context.trim().replace(/[<>]/g, '');
    }
    
    if (req.body.learningLevel) {
      req.body.learningLevel = req.body.learningLevel.trim().toLowerCase();
    }

    next();
  } catch (error) {
    res.status(400).json({
      error: 'Input sanitization failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// Request size validation
const validateRequestSize = (req, res, next) => {
  const contentLength = parseInt(req.headers['content-length'] || '0');
  const maxSize = 1024 * 1024; // 1MB

  if (contentLength > maxSize) {
    return res.status(413).json({
      error: 'Request too large',
      message: 'Request body exceeds 1MB limit',
      timestamp: new Date().toISOString()
    });
  }

  next();
};

// Content type validation
const validateContentType = (req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    const contentType = req.headers['content-type'];
    
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(415).json({
        error: 'Unsupported media type',
        message: 'Content-Type must be application/json',
        timestamp: new Date().toISOString()
      });
    }
  }

  next();
};

// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    };

    if (res.statusCode >= 400) {
      console.error('Request Error:', logData);
    } else {
      console.log('Request:', logData);
    }
  });

  next();
};

// Error handling middleware
const errorHandler = (error, req, res, next) => {
  console.error('Unhandled Error:', error);

  // Handle specific error types
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }

  if (error.name === 'SyntaxError' && error.status === 400) {
    return res.status(400).json({
      error: 'Invalid JSON',
      message: 'Request body contains invalid JSON',
      timestamp: new Date().toISOString()
    });
  }

  // Default error response
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  apiLimiter,
  sentimentAnalysisLimiter,
  batchAnalysisLimiter,
  sanitizeInput,
  validateRequestSize,
  validateContentType,
  requestLogger,
  errorHandler
};

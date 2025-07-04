const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const path = require("path");
const Sentry = require('@sentry/node');
const rateLimit = require('express-rate-limit');
const { redis } = require('./redisClient');
// const __dirname = path.resolve();

// Load environment variables first
dotenv.config({
  path: "./.env",
});

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

//Setting Up CORS Policy
var corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};
app.options("*", cors()); // preFlight
app.use("*", cors(corsOptions), function (req, res, next) {
  next();
});

//Body Parsing Configuration
app.use(express.json());
//Cookie Parsing Configuration
app.use(cookieParser());

const PORT = process.env.PORT || 8080;

// Debug route to check if server is running
app.get('/health', (req, res) => {
  console.log('Health check endpoint hit');
  res.status(200).json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Simple test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Sentry initialization (only if DSN is provided)
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
  });
  app.use(Sentry.Handlers.requestHandler());
  console.log('Sentry initialized');
} else {
  console.log('Sentry DSN not provided, skipping Sentry initialization');
}

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Mount all routes with error handling
console.log('\nRegistering routes...');
try {
  const { Router1,Router2,Router3,Router4, Router5 ,Router6,Router7,Router8,Router9,Router10,Router11,Router12,Router13,Router14} = require("./Routers/router.config");
  const otherRoutes = require('./Routes/Other_Routes');

  app.use('/api/v1/login', Router1);
  app.use('/api/v1/SignUp', Router2);
  app.use('/api/v1/CalculateResult', Router3);
  app.use('/api/v1/AddNewInterview', Router4);
  app.use('/api/v1/AddNewResult', Router5);
  app.use('/api/v1/SubmitInterview', Router6);
  app.use('/api/v1/ViewProfile', Router7);
  app.use('/api/v1/ViewInterviewList', Router8);
  app.use('/api/v1/ViewInterview', Router9);
  app.use('/api/v1/DetectEmotion', Router10);
  app.use('/api/v1/FindUser', Router11);
  app.use('/api/v1/FindResult', Router12);
  app.use('/api/v1/ToneAnalysis', Router13);
  app.use('/api/v1/Chatbot', Router14);

  // Mount Other Routes
  console.log('\nMounting Other Routes...');
  app.use('/api/v1', otherRoutes);
  console.log('Other Routes mounted successfully');
} catch (error) {
  console.error('Error loading routes:', error.message);
  // Continue without routes for now
}

// Log all registered routes
console.log('\nRegistered Routes:');
const printRoutes = (stack, basePath = '') => {
  stack.forEach(r => {
    if (r.route) {
      const methods = Object.keys(r.route.methods).map(m => m.toUpperCase()).join(',');
      console.log(`${methods} ${basePath}${r.route.path}`);
    } else if (r.name === 'router') {
      const newBasePath = basePath + (r.regexp.source.replace('^\\/','').replace('\\/?(?=\\/|$)',''));
      printRoutes(r.handle.stack, newBasePath);
    }
  });
};

printRoutes(app._router.stack);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "..", "client", "build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
  });
}

// Error Handling Middleware
app.use((Error, req, res, next) => {
  console.error('Error occurred:', Error);
  res.status(500).json({
    status: "System Error",
    message: "Unable to fetch your request",
    Error: Error.message,
  });
});

// Start BullMQ workers with error handling
console.log('\nInitializing background workers...');
try {
  require('./jobs/emailProcessor');
  require('./jobs/nlpProcessor');
  require('./jobs/resultProcessor');
  console.log(' All background workers initialized');
} catch (error) {
  console.error(' Error initializing background workers:', error.message);
  console.log('  Application will continue without background processing');
}

if (process.env.SENTRY_DSN) {
  app.use(Sentry.Handlers.errorHandler());
}

// Start server with error handling
const server = app.listen(PORT, () => {
  console.log(`\nServer is running on port ${PORT}`);
  console.log('\nAvailable endpoints:');
  console.log('- GET /health');
  console.log('- GET /test');
  console.log('- POST /api/v1/ViewProfile/update');
  console.log('- GET /api/v1/test');
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

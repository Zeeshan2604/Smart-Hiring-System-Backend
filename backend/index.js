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

const { Router1,Router2,Router3,Router4, Router5 ,Router6,Router7,Router8,Router9,Router10,Router11,Router12,Router13,Router14} = require("./Routers/router.config");
const otherRoutes = require('./Routes/Other_Routes');

//Body Parsing Configuration
app.use(express.json());
//Cookie Parsing Configuration
app.use(cookieParser());

//Environmental file Configuration
dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 8080;

// Debug route to check if server is running
app.get('/health', (req, res) => {
  console.log('Health check endpoint hit');
  res.json({ status: 'ok', message: 'Server is running' });
  });

// Sentry initialization
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});
app.use(Sentry.Handlers.requestHandler());

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Mount all routes
console.log('\nRegistering routes...');
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
    Error: Error,
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

app.use(Sentry.Handlers.errorHandler());

app.listen(PORT, () => {
  console.log(`\nServer is running on port ${PORT}`);
  console.log('\nAvailable endpoints:');
  console.log('- GET /health');
  console.log('- POST /api/v1/ViewProfile/update');
  console.log('- GET /api/v1/test');
});

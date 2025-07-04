# Backend Setup

## Prerequisites
- Node.js
- MongoDB
- **Redis** (for BullMQ, caching, and rate limiting)

## New Environment Variables
Add these to your `.env`:
```
REDIS_URL=redis://localhost:6379
SENTRY_DSN=your_sentry_dsn
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASS=yourpassword
```

## Install Dependencies
```
npm install
```

## Running with PM2
```
pm install -g pm2
pm2 start pm2.config.js
```

## Background Jobs
- Heavy tasks (NLP, scoring, email) are processed in the background using BullMQ and Redis.
- Email sending is now asynchronous.

## Caching
- Expensive queries are cached in Redis for performance.

## Rate Limiting
- API is protected with express-rate-limit (backed by Redis).

## Monitoring
- Errors are tracked with Sentry.
- Use PM2 for process management and monitoring. 
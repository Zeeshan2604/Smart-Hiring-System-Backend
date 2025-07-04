const Redis = require('ioredis');

// Check if Redis should be enabled
const REDIS_ENABLED = process.env.REDIS_ENABLED !== 'false' && process.env.REDIS_HOST;

// For BullMQ, export a plain object with connection options
const bullmqConnection = REDIS_ENABLED ? {
  connection: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null,
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);
      console.log(`Redis connection attempt ${times}, retrying in ${delay}ms...`);
      return delay;
    },
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    connectTimeout: 10000,
  }
} : null;

// For general Redis usage with better error handling
let redis;

if (REDIS_ENABLED) {
  try {
    redis = new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      enableReadyCheck: false,
      connectTimeout: 10000,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        console.log(`Redis connection attempt ${times}, retrying in ${delay}ms...`);
        return delay;
      }
    });

    redis.on('connect', () => {
      console.log('Connected to Redis successfully');
    });

    redis.on('ready', () => {
      console.log('Redis is ready to accept commands');
    });

    redis.on('error', (err) => {
      console.error('Redis connection error:', err.message);
      // Don't crash the app, just log the error
    });

    redis.on('close', () => {
      console.log('Redis connection closed');
    });

    redis.on('reconnecting', () => {
      console.log('Redis reconnecting...');
    });

  } catch (error) {
    console.error('Failed to initialize Redis client:', error.message);
    // Create a mock Redis client that doesn't crash the app
    redis = createMockRedis();
  }
} else {
  console.log('Redis is disabled. Using mock Redis client.');
  redis = createMockRedis();
}

function createMockRedis() {
  return {
    get: async () => null,
    set: async () => 'OK',
    del: async () => 1,
    exists: async () => 0,
    on: () => {},
    disconnect: () => {},
    connect: () => Promise.resolve()
  };
}

module.exports = { redis, bullmqConnection }; 
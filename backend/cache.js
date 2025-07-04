const { redis } = require('./redisClient');

async function getCache(key) {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.log('Cache get error (Redis may be unavailable):', error.message);
    return null;
  }
}

async function setCache(key, value, ttl = 60) {
  try {
    await redis.set(key, JSON.stringify(value), 'EX', ttl);
  } catch (error) {
    console.log('Cache set error (Redis may be unavailable):', error.message);
    // Don't throw error, just log it
  }
}

module.exports = { getCache, setCache }; 
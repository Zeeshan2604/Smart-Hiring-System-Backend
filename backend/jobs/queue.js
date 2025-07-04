const { Queue } = require('bullmq');
const { bullmqConnection } = require('../redisClient');

// Create queue with better error handling
let jobQueue;

if (bullmqConnection) {
  try {
    jobQueue = new Queue('jobQueue', { 
      connection: bullmqConnection.connection,
      defaultJobOptions: {
        removeOnComplete: 10,
        removeOnFail: 5,
      }
    });
    
    console.log('BullMQ queue initialized successfully');
  } catch (error) {
    console.error('Failed to initialize BullMQ queue:', error.message);
    // Create a mock queue that doesn't crash the app
    jobQueue = createMockQueue();
  }
} else {
  console.log('Redis is disabled. Using mock BullMQ queue.');
  jobQueue = createMockQueue();
}

function createMockQueue() {
  return {
    add: async () => ({ id: 'mock-job-id' }),
    getJob: async () => null,
    getJobs: async () => [],
    on: () => {},
    close: async () => {}
  };
}

module.exports = jobQueue; 
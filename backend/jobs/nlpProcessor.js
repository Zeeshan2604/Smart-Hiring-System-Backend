const { Worker } = require('bullmq');
const { bullmqConnection } = require('../redisClient');

let nlpWorker;

if (bullmqConnection) {
  try {
    nlpWorker = new Worker('jobQueue', async job => {
      if (job.name === 'nlpTask') {
        // Placeholder: Insert NLP/scoring logic here
        // Example: const result = await runNLP(job.data.text);
        // Save result to DB or return as needed
      }
    }, bullmqConnection);
    
    console.log('NLP worker initialized successfully');
  } catch (error) {
    console.error('Failed to initialize NLP worker:', error.message);
    nlpWorker = createMockWorker();
  }
} else {
  console.log('Redis is disabled. Using mock NLP worker.');
  nlpWorker = createMockWorker();
}

function createMockWorker() {
  return {
    on: () => {},
    close: async () => {}
  };
}

module.exports = nlpWorker; 
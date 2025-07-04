const jobQueue = require('./queue');

async function enqueueResultJob(data) {
  await jobQueue.add('calculateResult', data);
}

module.exports = { enqueueResultJob }; 
const { Worker } = require('bullmq');
const { bullmqConnection } = require('../redisClient');
const { String_Comparison_Function } = require('../Controllers/Other_Controller/Helping_Functions/String_Comparison_Function');
const { Interview_Result_Model } = require('../DatabaseSetup/Mongoose.Result.Schema');

let resultWorker;

if (bullmqConnection) {
  try {
    resultWorker = new Worker('jobQueue', async job => {
      if (job.name === 'calculateResult') {
        const { candidateName, candidateEmail, companyName, questions, answers, ...rest } = job.data;
        // Run scoring
        const [answerResults, finalPercentage, toneResults] = await String_Comparison_Function(questions, answers);
        // Save result to DB
        await Interview_Result_Model.create({
          Candidate_Name: candidateName,
          Candidate_Email: candidateEmail,
          Company_Name: companyName,
          Question_Arrays: questions,
          Answer_Arrays: answers,
          Text_Percentage: finalPercentage,
          Tone_Result_Array: toneResults,
          Answer_Result_Array: answerResults,
          ...rest
        });
      }
    }, bullmqConnection);
    
    console.log('Result worker initialized successfully');
  } catch (error) {
    console.error('Failed to initialize result worker:', error.message);
    resultWorker = createMockWorker();
  }
} else {
  console.log('Redis is disabled. Using mock result worker.');
  resultWorker = createMockWorker();
}

function createMockWorker() {
  return {
    on: () => {},
    close: async () => {}
  };
}

module.exports = resultWorker; 
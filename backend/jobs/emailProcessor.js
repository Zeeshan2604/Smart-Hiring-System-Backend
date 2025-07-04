const { Worker } = require('bullmq');
const nodemailer = require('nodemailer');
const { bullmqConnection } = require('../redisClient');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

let emailWorker;

if (bullmqConnection) {
  try {
    emailWorker = new Worker('jobQueue', async job => {
      if (job.name === 'sendEmail') {
        const { to, subject, text, html } = job.data;
        await transporter.sendMail({ from: process.env.SMTP_USER, to, subject, text, html });
      }
    }, bullmqConnection);
    
    console.log('Email worker initialized successfully');
  } catch (error) {
    console.error('Failed to initialize email worker:', error.message);
    emailWorker = createMockWorker();
  }
} else {
  console.log('Redis is disabled. Using mock email worker.');
  emailWorker = createMockWorker();
}

function createMockWorker() {
  return {
    on: () => {},
    close: async () => {}
  };
}

module.exports = emailWorker; 
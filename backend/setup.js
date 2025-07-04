const { exec } = require('child_process');
const fs = require('fs');

console.log('🚀 Setting up Smart Hiring System Backend...\n');

// Check if package.json exists
if (!fs.existsSync('package.json')) {
  console.error('❌ package.json not found. Please run this script from the backend directory.');
  process.exit(1);
}

console.log('📦 Installing dependencies...');
exec('npm install', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Error installing dependencies:', error.message);
    return;
  }
  
  console.log('✅ Dependencies installed successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Make sure you have a .env file with your AWS credentials:');
  console.log('   accessKeyId=your_access_key');
  console.log('   secretAccessKey=your_secret_key');
  console.log('   region=your_aws_region');
  console.log('\n2. For Redis (optional - app will work without it):');
  console.log('   - Install Redis: https://redis.io/download');
  console.log('   - Or use Docker: docker run -d -p 6379:6379 redis:alpine');
  console.log('   - Or use a cloud Redis service');
  console.log('\n3. Start the application:');
  console.log('   npm start');
  console.log('\n✨ Setup complete!');
}); 
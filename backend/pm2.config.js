module.exports = {
  apps: [
    {
      name: 'smart-hiring-backend',
      script: 'index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}; 
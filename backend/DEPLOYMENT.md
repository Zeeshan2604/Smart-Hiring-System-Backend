# Render Deployment Guide

## Prerequisites

1. **GitHub Account** - Your code must be on GitHub
2. **Render Account** - Sign up at [render.com](https://render.com)
3. **MongoDB Atlas** - Cloud database (free tier available)
4. **AWS Account** - For Rekognition service
5. **Email Service** - Gmail or other SMTP provider

## Step 1: Prepare Your Code

### 1.1 Environment Variables
Create a `.env` file in the backend directory with your production values:

```env
# Server Configuration
NODE_ENV=production
PORT=8080

# Database Configuration
MONGOOSE_CONNECTION=mongodb+srv://username:password@cluster.mongodb.net/smart-hiring-system?retryWrites=true&w=majority

# AWS Configuration
accessKeyId=your_aws_access_key_here
secretAccessKey=your_aws_secret_key_here
region=us-east-1

# Redis Configuration (will be auto-filled by Render)
REDIS_ENABLED=true
REDIS_HOST=your_redis_host_from_render
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password_from_render

# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Sentry Configuration
SENTRY_DSN=your_sentry_dsn_here

# JWT Secret
JWT_SECRET=your_jwt_secret_here
```

### 1.2 Update render.yaml
Edit the `render.yaml` file with your actual values:
- Replace `your-mongodb-connection-string` with your MongoDB Atlas connection string
- Replace `your-aws-access-key` with your AWS access key
- Replace `your-aws-secret-key` with your AWS secret key
- Replace `your-aws-region` with your AWS region

## Step 2: Set Up MongoDB Atlas

1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com/atlas](https://mongodb.com/atlas)
   - Sign up for free account

2. **Create Cluster**
   - Choose "Shared" (free tier)
   - Select cloud provider and region
   - Create cluster

3. **Set Up Database Access**
   - Create database user with password
   - Note down username and password

4. **Set Up Network Access**
   - Add IP address: `0.0.0.0/0` (allow all IPs)

5. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password

## Step 3: Set Up AWS

1. **Create AWS Account**
   - Go to [aws.amazon.com](https://aws.amazon.com)
   - Sign up for account

2. **Create IAM User**
   - Go to IAM service
   - Create new user with programmatic access
   - Attach `AmazonRekognitionFullAccess` policy
   - Note down Access Key ID and Secret Access Key

## Step 4: Deploy to Render

### 4.1 Connect GitHub Repository
1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Connect to Render**
   - Go to [dashboard.render.com](https://dashboard.render.com)
   - Click "New +"
   - Select "Blueprint"
   - Connect your GitHub repository

### 4.2 Configure Services
1. **Review Blueprint**
   - Render will detect your `render.yaml`
   - Review the services configuration

2. **Set Environment Variables**
   - Click on your web service
   - Go to "Environment" tab
   - Add all environment variables from your `.env` file

3. **Deploy**
   - Click "Create New Blueprint Instance"
   - Render will create both web service and Redis service
   - Wait for deployment to complete

## Step 5: Configure Frontend

### 5.1 Update API Endpoints
In your frontend code, update all API calls to use your Render URL:
```javascript
// Replace localhost:8080 with your Render URL
const API_BASE_URL = 'https://your-app-name.onrender.com';
```

### 5.2 Deploy Frontend
You can deploy your React frontend to:
- **Vercel** (recommended for frontend)
- **Netlify**
- **GitHub Pages**

## Step 6: Test Your Deployment

1. **Health Check**
   ```bash
   curl https://your-app-name.onrender.com/health
   ```

2. **Test API Endpoints**
   - Test login/signup
   - Test interview functionality
   - Test emotion detection

3. **Monitor Logs**
   - Go to Render dashboard
   - Click on your service
   - Check "Logs" tab for any errors

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check package.json for correct dependencies
   - Ensure all environment variables are set

2. **Database Connection Issues**
   - Verify MongoDB Atlas connection string
   - Check network access settings

3. **Redis Connection Issues**
   - Ensure Redis service is created in Render
   - Check environment variables are linked correctly

4. **AWS Errors**
   - Verify AWS credentials
   - Check IAM permissions

### Support
- **Render Documentation**: [render.com/docs](https://render.com/docs)
- **MongoDB Atlas**: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- **AWS Documentation**: [docs.aws.amazon.com](https://docs.aws.amazon.com)

## Cost Estimation

### Free Tier (Development)
- **Render Web Service**: Free (750 hours/month)
- **Render Redis**: Free (750 hours/month)
- **MongoDB Atlas**: Free (512MB storage)
- **AWS**: Free tier available

### Production (Recommended)
- **Render Web Service**: $7/month
- **Render Redis**: $7/month
- **MongoDB Atlas**: $9/month
- **AWS**: Pay per use (~$1-5/month)

**Total**: ~$24/month for production deployment 
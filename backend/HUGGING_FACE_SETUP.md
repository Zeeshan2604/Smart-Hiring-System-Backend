# Hugging Face Setup Guide (FREE Alternative to AWS)

## 🎯 Why Hugging Face?

- **✅ 100% FREE** - No credit card required
- **✅ No usage limits** for basic usage
- **✅ No monthly fees**
- **✅ Easy setup**
- **✅ Multiple AI models available**

## 📋 Step-by-Step Setup

### Step 1: Create Hugging Face Account

1. **Go to Hugging Face**
   - Visit: [huggingface.co](https://huggingface.co)
   - Click **"Sign Up"**

2. **Create Account**
   - Use your email or GitHub account
   - **No credit card required**
   - **Completely free**

### Step 2: Get Your API Token

1. **Go to Settings**
   - Click your profile picture
   - Select **"Settings"**

2. **Create Access Token**
   - Go to **"Access Tokens"** tab
   - Click **"New token"**
   - Name it: `smart-hiring-system`
   - Select **"Read"** role
   - Click **"Generate token"**

3. **Copy Your Token**
   - Save the token (it looks like: `hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)
   - **Keep it secure** - you'll need it for your app

### Step 3: Test the API

You can test the API directly in your browser:

```bash
# Test with curl
curl -X POST https://api-inference.huggingface.co/models/facebook/detr-resnet-50 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"inputs": "https://example.com/image.jpg"}'
```

### Step 4: Add Token to Your Environment

Add this to your `.env` file:

```env
HUGGING_FACE_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 🔧 Available Models

### Face Detection Models (FREE)

1. **facebook/detr-resnet-50** (Currently used)
   - Object detection
   - Good for face detection
   - Fast and accurate

2. **microsoft/DialoGPT-medium**
   - Text generation
   - Good for chatbot features

3. **facebook/bart-large-cnn**
   - Text summarization
   - Good for resume analysis

## 💰 Cost Comparison

| Service | Cost | Setup |
|---------|------|-------|
| **AWS Rekognition** | $0.001/image | Complex |
| **Hugging Face** | **FREE** | Simple |
| **Google Cloud Vision** | $0.0015/image | Complex |
| **Azure Computer Vision** | $0.001/image | Complex |

## 🚀 Benefits of Hugging Face

### ✅ Advantages
- **No costs** - completely free
- **No credit card** required
- **Simple setup** - just get a token
- **Multiple models** available
- **Good documentation**
- **Active community**

### ⚠️ Limitations
- **Rate limits** for heavy usage
- **Model loading time** on first request
- **Less specialized** than AWS for face detection

## 🔄 Migration from AWS

### What Changed
1. **Removed AWS SDK** dependency
2. **Added Hugging Face API** calls
3. **Updated environment variables**
4. **Added fallback responses**

### Environment Variables Updated
```env
# OLD (AWS)
accessKeyId=your_aws_key
secretAccessKey=your_aws_secret
region=us-east-1

# NEW (Hugging Face)
HUGGING_FACE_TOKEN=your_hugging_face_token
```

## 🧪 Testing Your Setup

### Test the API Endpoint

1. **Start your server**
   ```bash
   cd backend
   npm start
   ```

2. **Test emotion detection**
   ```bash
   curl -X POST http://localhost:8080/api/v1/DetectEmotion \
     -H "Content-Type: application/json" \
     -d '{"imageUrl": "https://example.com/test-image.jpg"}'
   ```

3. **Check response**
   - Should return face detection results
   - If API fails, returns mock data

## 🛠️ Troubleshooting

### Common Issues

1. **"Invalid token" error**
   - Check your `HUGGING_FACE_TOKEN` is correct
   - Make sure token has "Read" permissions

2. **"Model loading" delay**
   - First request takes longer
   - Subsequent requests are faster

3. **"Rate limit" error**
   - Too many requests
   - Wait a few minutes and try again

### Fallback Mode

If Hugging Face API fails, your app will:
- Return mock emotion data
- Continue working normally
- Log the error for debugging

## 📚 Additional Resources

- **Hugging Face Docs**: [huggingface.co/docs](https://huggingface.co/docs)
- **API Reference**: [huggingface.co/docs/api-inference](https://huggingface.co/docs/api-inference)
- **Model Hub**: [huggingface.co/models](https://huggingface.co/models)

## 🎉 You're All Set!

Your smart hiring system now uses **completely free** AI services:

- ✅ **No AWS costs**
- ✅ **No credit card required**
- ✅ **Simple setup**
- ✅ **Reliable fallback**

Ready to deploy to Render! 🚀 
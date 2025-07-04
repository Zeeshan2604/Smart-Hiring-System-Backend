# Smart Hiring System

A comprehensive AI-powered hiring platform that combines video interviews, emotion detection, and automated candidate evaluation.

## 🚀 Features

- **Video Interviews**: Real-time video recording and analysis
- **Emotion Detection**: AWS Rekognition integration for facial analysis
- **AI-Powered Evaluation**: Natural language processing for answer scoring
- **Background Job Processing**: Redis-powered queue system for heavy tasks
- **Real-time Results**: Instant candidate evaluation and feedback
- **Multi-role Support**: Separate interfaces for organizations and candidates
- **Resume Builder**: Integrated resume creation tool

## 🏗️ Architecture

### Backend (Node.js + Express)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Cache/Queue**: Redis with BullMQ
- **AI Services**: AWS Rekognition, Natural Language Processing
- **Authentication**: JWT-based authentication
- **Background Jobs**: Email processing, NLP analysis, result calculation

### Frontend (React)
- **Framework**: React.js
- **Styling**: CSS3 with modern UI/UX
- **Video Recording**: WebRTC integration
- **Real-time Updates**: WebSocket connections

## 📁 Project Structure

```
smart-hiring-system/
├── backend/                 # Node.js API server
│   ├── Controllers/         # Business logic
│   ├── DatabaseSetup/       # MongoDB schemas
│   ├── jobs/               # Background job processors
│   ├── Authentication/     # JWT middleware
│   ├── Routes/             # API endpoints
│   └── index.js            # Server entry point
├── client/                 # React frontend
│   ├── src/
│   │   ├── organization/   # Organization dashboard
│   │   ├── Student/        # Candidate interface
│   │   ├── ResumeBuilder/  # Resume creation tool
│   │   └── components/     # Reusable components
│   └── public/             # Static assets
└── README.md               # This file
```

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Redis** - Caching and job queue
- **BullMQ** - Background job processing
- **AWS SDK v3** - Cloud services integration
- **JWT** - Authentication
- **Nodemailer** - Email functionality

### Frontend
- **React.js** - UI framework
- **WebRTC** - Video recording
- **CSS3** - Styling
- **Axios** - HTTP client

### DevOps
- **Render** - Hosting platform
- **MongoDB Atlas** - Cloud database
- **AWS** - AI services

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Redis (optional for local development)
- AWS Account (for Rekognition)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/smart-hiring-system.git
   cd smart-hiring-system
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**
   ```bash
   # In backend directory, create .env file
   cp .env.example .env
   # Edit .env with your actual values
   ```

5. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```

6. **Start the frontend development server**
   ```bash
   cd client
   npm start
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080

## 🌐 Deployment

### Render Deployment (Recommended)

1. **Prepare your code** (see `backend/DEPLOYMENT.md`)
2. **Set up MongoDB Atlas**
3. **Configure AWS services**
4. **Deploy to Render** using the provided `render.yaml`

For detailed deployment instructions, see [DEPLOYMENT.md](backend/DEPLOYMENT.md)

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/v1/login` - User login
- `POST /api/v1/SignUp` - User registration

### Interview Management
- `POST /api/v1/AddNewInterview` - Create new interview
- `POST /api/v1/SubmitInterview` - Submit interview responses
- `GET /api/v1/ViewInterviewList` - List all interviews

### Results & Analysis
- `POST /api/v1/CalculateResult` - Calculate interview results
- `POST /api/v1/DetectEmotion` - Analyze facial emotions
- `POST /api/v1/ToneAnalysis` - Analyze speech tone

### Health Check
- `GET /health` - Server health status

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGOOSE_CONNECTION` | MongoDB connection string | Yes |
| `accessKeyId` | AWS access key | Yes |
| `secretAccessKey` | AWS secret key | Yes |
| `region` | AWS region | Yes |
| `REDIS_ENABLED` | Enable/disable Redis | No |
| `REDIS_HOST` | Redis host | If Redis enabled |
| `REDIS_PORT` | Redis port | If Redis enabled |
| `REDIS_PASSWORD` | Redis password | If Redis enabled |
| `SMTP_HOST` | Email server host | No |
| `SMTP_PORT` | Email server port | No |
| `SMTP_USER` | Email username | No |
| `SMTP_PASS` | Email password | No |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

- **Documentation**: Check the `DEPLOYMENT.md` file for detailed setup instructions
- **Issues**: Create an issue on GitHub for bugs or feature requests
- **Email**: Contact the development team for support

## 🎯 Roadmap

- [ ] Mobile app development
- [ ] Advanced AI analytics
- [ ] Multi-language support
- [ ] Integration with job boards
- [ ] Advanced reporting dashboard
- [ ] Video interview scheduling
- [ ] Automated follow-up emails

---

**Built with ❤️ by the Smart Hiring Team**



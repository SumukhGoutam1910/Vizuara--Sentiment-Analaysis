# Sentiment Analysis Backend

A powerful backend API for the Sentiment Analysis learning application, powered by Google's Gemini AI. This backend provides intelligent sentiment analysis with educational context, making it perfect for teaching 6th-grade students about emotions in text.

## 🚀 Features

- **AI-Powered Analysis**: Uses Google Gemini AI for intelligent sentiment analysis
- **Educational Context**: Provides explanations suitable for 6th-grade students
- **Learning Recommendations**: Suggests next steps for improvement
- **Batch Processing**: Analyze multiple texts at once
- **Rate Limiting**: Built-in protection against API abuse
- **Security**: Input sanitization and validation
- **Fallback System**: Graceful degradation when AI is unavailable

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Google Gemini AI** - AI sentiment analysis
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger
- **Rate Limiting** - API abuse protection

## 📋 Prerequisites

- Node.js 16.0.0 or higher
- npm or yarn package manager
- Google Gemini API key

## 🔧 Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp config.env.example .env
   ```
   
   Edit `.env` and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

## 🌐 API Endpoints

### Health Check
- **GET** `/health` - Check if the service is running

### Sentiment Analysis
- **POST** `/api/sentiment/analyze` - Basic sentiment analysis
- **POST** `/api/sentiment/analyze-with-context` - Enhanced analysis with learning context
- **POST** `/api/sentiment/batch-analyze` - Analyze multiple texts
- **POST** `/api/sentiment/recommendations` - Get learning recommendations

### Service Information
- **GET** `/api/sentiment/info` - Get API information and capabilities

## 📖 API Usage Examples

### Basic Sentiment Analysis

```bash
curl -X POST http://localhost:5000/api/sentiment/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "text": "I am so excited about learning sentiment analysis!",
    "context": "educational"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sentiment": "positive",
    "confidence": 95,
    "emotionalIndicators": ["excited", "learning"],
    "explanation": "This text shows positive sentiment because it uses words like 'excited' and expresses enthusiasm about learning.",
    "examples": ["I love this!", "This is amazing!"],
    "learningTips": ["Look for words that express positive emotions"],
    "difficulty": "beginner",
    "context": "educational"
  },
  "originalText": "I am so excited about learning sentiment analysis!",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Enhanced Analysis with Learning Context

```bash
curl -X POST http://localhost:5000/api/sentiment/analyze-with-context \
  -H "Content-Type: application/json" \
  -d '{
    "text": "I feel sad because I didn't understand the lesson",
    "learningLevel": "beginner",
    "includeExamples": true,
    "includeTips": true
  }'
```

### Batch Analysis

```bash
curl -X POST http://localhost:5000/api/sentiment/batch-analyze \
  -H "Content-Type: application/json" \
  -d '{
    "texts": [
      "I love this game!",
      "This is terrible",
      "I feel neutral about this"
    ],
    "batchSize": 3,
    "learningLevel": "beginner"
  }'
```

## 🔒 Security Features

- **Rate Limiting**: Prevents API abuse
- **Input Sanitization**: Removes potentially harmful content
- **Request Validation**: Ensures proper data format
- **CORS Protection**: Controls cross-origin access
- **Helmet Security**: Adds security headers

## 📊 Rate Limits

- **General API**: 100 requests per 15 minutes
- **Sentiment Analysis**: 20 requests per minute
- **Batch Analysis**: 10 requests per 5 minutes

## 🚨 Error Handling

The API provides detailed error messages with appropriate HTTP status codes:

- **400**: Bad Request (invalid input)
- **413**: Payload Too Large
- **415**: Unsupported Media Type
- **429**: Too Many Requests (rate limited)
- **500**: Internal Server Error
- **503**: Service Unavailable (Gemini API down)

## 🧪 Testing

You can test the API using:

1. **Postman** or **Insomnia**
2. **cURL** commands
3. **Frontend application** (when connected)

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `GEMINI_API_KEY` | Google Gemini API key | Required |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |
| `NODE_ENV` | Environment mode | `development` |

### Customization

You can modify:
- Rate limiting thresholds in `middleware/security.js`
- Gemini prompts in `utils/geminiUtils.js`
- API endpoints in `routes/sentimentRoutes.js`

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Docker (optional)
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 📝 Logging

The API logs:
- All HTTP requests with timing
- Errors and exceptions
- Rate limit violations
- Gemini API interactions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

If you encounter issues:

1. Check the logs for error messages
2. Verify your Gemini API key is valid
3. Ensure all environment variables are set
4. Check rate limiting if you're getting 429 errors

## 🔮 Future Enhancements

- Database integration for progress tracking
- User authentication and profiles
- Advanced analytics and reporting
- Multiple AI model support
- Real-time sentiment analysis
- WebSocket support for live updates

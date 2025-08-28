const API_BASE_URL = 'http://localhost:5000/api/sentiment';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Basic sentiment analysis
  async analyzeSentiment(text, context = 'educational') {
    try {
      const response = await fetch(`${this.baseURL}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, context })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      throw error;
    }
  }

  // Enhanced sentiment analysis with context
  async analyzeSentimentWithContext(text, options = {}) {
    try {
      const {
        learningLevel = 'beginner',
        includeExamples = true,
        includeTips = true
      } = options;

      const response = await fetch(`${this.baseURL}/analyze-with-context`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          learningLevel,
          includeExamples,
          includeTips
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error analyzing sentiment with context:', error);
      throw error;
    }
  }

  // Batch analysis
  async batchAnalyze(texts, options = {}) {
    try {
      const {
        batchSize = 5,
        learningLevel = 'beginner'
      } = options;

      const response = await fetch(`${this.baseURL}/batch-analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          texts,
          batchSize,
          learningLevel
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error in batch analysis:', error);
      throw error;
    }
  }

  // Get learning recommendations
  async getLearningRecommendations(analysis, userLevel = 'beginner') {
    try {
      const response = await fetch(`${this.baseURL}/recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          analysis,
          userLevel
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting learning recommendations:', error);
      throw error;
    }
  }

  // Get service info
  async getServiceInfo() {
    try {
      const response = await fetch(`${this.baseURL}/info`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting service info:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    try {
      const response = await fetch('http://localhost:5000/health');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error in health check:', error);
      throw error;
    }
  }
}

export default new ApiService();

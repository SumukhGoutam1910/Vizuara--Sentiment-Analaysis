const express = require('express');
const router = express.Router();
const GeminiUtils = require('../utils/geminiUtils');

// Initialize Gemini utilities
let geminiUtils;
try {
  geminiUtils = new GeminiUtils(process.env.GEMINI_API_KEY);
} catch (error) {
  console.error('Failed to initialize Gemini:', error);
}

// Middleware to check if Gemini is available
const checkGeminiAvailability = (req, res, next) => {
  if (!geminiUtils) {
    return res.status(503).json({
      error: 'Gemini AI service unavailable',
      message: 'Please check your API key configuration',
      timestamp: new Date().toISOString()
    });
  }
  next();
};

// Basic sentiment analysis
router.post('/analyze', checkGeminiAvailability, async (req, res) => {
  try {
    const { text, context = 'general' } = req.body;

    // Input validation
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Text must be a non-empty string',
        timestamp: new Date().toISOString()
      });
    }

    if (text.length > 1000) {
      return res.status(400).json({
        error: 'Text too long',
        message: 'Text must be 1000 characters or less',
        timestamp: new Date().toISOString()
      });
    }

    const result = await geminiUtils.analyzeSentiment(text, {
      context,
      learningLevel: 'beginner',
      includeExamples: true,
      includeTips: true
    });

    res.json(result);

  } catch (error) {
    console.error('Sentiment analysis error:', error);
    res.status(500).json({
      error: 'Analysis failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Enhanced analysis with learning context
router.post('/analyze-with-context', checkGeminiAvailability, async (req, res) => {
  try {
    const { 
      text, 
      learningLevel = 'beginner', 
      previousAnalysis = null,
      includeExamples = true,
      includeTips = true
    } = req.body;

    // Input validation
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Text must be a non-empty string',
        timestamp: new Date().toISOString()
      });
    }

    if (!['beginner', 'intermediate', 'advanced'].includes(learningLevel)) {
      return res.status(400).json({
        error: 'Invalid learning level',
        message: 'Learning level must be beginner, intermediate, or advanced',
        timestamp: new Date().toISOString()
      });
    }

    const result = await geminiUtils.analyzeSentiment(text, {
      context: 'educational',
      learningLevel,
      includeExamples,
      includeTips
    });

    // Add learning recommendations if analysis was successful
    if (result.success) {
      try {
        const recommendations = await geminiUtils.getLearningRecommendations(
          result.data, 
          learningLevel
        );
        result.data.recommendations = recommendations;
      } catch (recError) {
        console.warn('Failed to get recommendations:', recError);
        // Continue without recommendations
      }
    }

    res.json(result);

  } catch (error) {
    console.error('Context analysis error:', error);
    res.status(500).json({
      error: 'Context analysis failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Batch analysis for multiple texts
router.post('/batch-analyze', checkGeminiAvailability, async (req, res) => {
  try {
    const { texts, batchSize = 5, learningLevel = 'beginner' } = req.body;

    // Input validation
    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Texts must be a non-empty array',
        timestamp: new Date().toISOString()
      });
    }

    if (texts.length > 10) {
      return res.status(400).json({
        error: 'Too many texts',
        message: 'Maximum 10 texts allowed per batch',
        timestamp: new Date().toISOString()
      });
    }

    // Validate each text
    for (let i = 0; i < texts.length; i++) {
      if (!texts[i] || typeof texts[i] !== 'string' || texts[i].trim().length === 0) {
        return res.status(400).json({
          error: 'Invalid text in array',
          message: `Text at index ${i} is invalid`,
          timestamp: new Date().toISOString()
        });
      }
      if (texts[i].length > 500) {
        return res.status(400).json({
          error: 'Text too long',
          message: `Text at index ${i} exceeds 500 characters`,
          timestamp: new Date().toISOString()
        });
      }
    }

    const result = await geminiUtils.batchAnalyze(texts, {
      batchSize: Math.min(batchSize, 10),
      delayMs: 200, // Increased delay for batch processing
      learningLevel
    });

    res.json(result);

  } catch (error) {
    console.error('Batch analysis error:', error);
    res.status(500).json({
      error: 'Batch analysis failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get learning recommendations
router.post('/recommendations', checkGeminiAvailability, async (req, res) => {
  try {
    const { analysis, userLevel = 'beginner' } = req.body;

    if (!analysis || typeof analysis !== 'object') {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Analysis object is required',
        timestamp: new Date().toISOString()
      });
    }

    if (!['beginner', 'intermediate', 'advanced'].includes(userLevel)) {
      return res.status(400).json({
        error: 'Invalid user level',
        message: 'User level must be beginner, intermediate, or advanced',
        timestamp: new Date().toISOString()
      });
    }

    const recommendations = await geminiUtils.getLearningRecommendations(analysis, userLevel);

    res.json({
      success: true,
      data: recommendations,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({
      error: 'Failed to get recommendations',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Health check for sentiment service
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Sentiment Analysis',
    geminiAvailable: !!geminiUtils,
    timestamp: new Date().toISOString()
  });
});

// Get service information
router.get('/info', (req, res) => {
  res.json({
    service: 'Sentiment Analysis API',
    version: '1.0.0',
    features: [
      'Basic sentiment analysis',
      'Context-aware analysis',
      'Batch processing',
      'Learning recommendations',
      'Educational explanations'
    ],
    supportedLevels: ['beginner', 'intermediate', 'advanced'],
    maxTextLength: 1000,
    maxBatchSize: 10,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;

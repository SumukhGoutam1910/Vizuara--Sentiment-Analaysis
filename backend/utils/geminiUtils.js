const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiUtils {
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error('Gemini API key is required');
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  /**
   * Analyze sentiment with educational context
   */
  async analyzeSentiment(text, options = {}) {
    const {
      context = 'general',
      learningLevel = 'beginner',
      includeExamples = true,
      includeTips = true
    } = options;

    try {
      const prompt = this.buildSentimentPrompt(text, context, learningLevel, includeExamples, includeTips);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const textResponse = response.text();

      return this.parseGeminiResponse(textResponse, text);
    } catch (error) {
      console.error('Gemini API Error:', error);
      return this.createFallbackResponse(text, error.message);
    }
  }

  /**
   * Build a comprehensive prompt for sentiment analysis
   */
  buildSentimentPrompt(text, context, learningLevel, includeExamples, includeTips) {
    let prompt = `As an AI teacher helping 6th-grade students learn sentiment analysis, analyze this text:

Text: "${text}"
Context: ${context}
Learning Level: ${learningLevel}

Please provide a comprehensive analysis that includes:
1. Overall sentiment (positive, negative, or neutral)
2. Confidence score (0-100)
3. Key emotional indicators found
4. Educational explanation suitable for ${learningLevel} level`;

    if (includeExamples) {
      prompt += `
5. Examples of similar sentiment patterns`;
    }

    if (includeTips) {
      prompt += `
6. Learning tips for the student`;
    }

    prompt += `

Format your response as JSON with these exact keys:
{
  "sentiment": "positive|negative|neutral",
  "confidence": number,
  "emotionalIndicators": ["word1", "word2", ...],
  "explanation": "educational explanation"`;

    if (includeExamples) {
      prompt += `,
  "examples": ["example1", "example2", ...]`;
    }

    if (includeTips) {
      prompt += `,
  "learningTips": ["tip1", "tip2", ...]`;
    }

    prompt += `,
  "difficulty": "beginner|intermediate|advanced",
  "context": "${context}"
}

Be helpful and educational, as this is for 6th-grade students learning about sentiment analysis.`;

    return prompt;
  }

  /**
   * Parse Gemini's response and extract JSON
   */
  parseGeminiResponse(textResponse, originalText) {
    try {
      // Try to find JSON in the response
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // Validate required fields
        if (!parsed.sentiment || !parsed.confidence) {
          throw new Error('Missing required fields in response');
        }

        return {
          success: true,
          data: parsed,
          originalText,
          timestamp: new Date().toISOString()
        };
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.warn('Failed to parse Gemini response:', parseError);
      return this.createFallbackResponse(originalText, 'Response parsing failed');
    }
  }

  /**
   * Create a fallback response when Gemini fails
   */
  createFallbackResponse(text, errorMessage) {
    // Simple fallback sentiment analysis
    const positiveWords = ['happy', 'excited', 'amazing', 'wonderful', 'love', 'great', 'fantastic', 'awesome'];
    const negativeWords = ['sad', 'angry', 'terrible', 'awful', 'hate', 'bad', 'horrible', 'disappointed'];
    
    const lowerText = text.toLowerCase();
    let positiveCount = 0;
    let negativeCount = 0;
    
    positiveWords.forEach(word => {
      if (lowerText.includes(word)) positiveCount++;
    });
    
    negativeWords.forEach(word => {
      if (lowerText.includes(word)) negativeCount++;
    });

    let sentiment = 'neutral';
    let confidence = 50;
    
    if (positiveCount > negativeCount) {
      sentiment = 'positive';
      confidence = Math.min(90, 50 + (positiveCount * 10));
    } else if (negativeCount > positiveCount) {
      sentiment = 'negative';
      confidence = Math.min(90, 50 + (negativeCount * 10));
    }

    return {
      success: false,
      data: {
        sentiment,
        confidence,
        emotionalIndicators: this.extractEmotionalWords(lowerText),
        explanation: `Fallback analysis: ${sentiment} sentiment detected`,
        examples: [`This text shows ${sentiment} sentiment`],
        learningTips: ['Practice identifying emotional words in texts'],
        difficulty: 'beginner',
        context: 'fallback',
        error: errorMessage
      },
      originalText: text,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Extract emotional words from text
   */
  extractEmotionalWords(text) {
    const emotionalWords = [
      'happy', 'excited', 'amazing', 'wonderful', 'love', 'great', 'fantastic', 'awesome',
      'sad', 'angry', 'terrible', 'awful', 'hate', 'bad', 'horrible', 'disappointed',
      'joy', 'delight', 'pleasure', 'satisfaction', 'fear', 'worry', 'anxiety', 'stress'
    ];

    const found = emotionalWords.filter(word => text.includes(word));
    return found.slice(0, 5); // Limit to 5 words
  }

  /**
   * Batch analyze multiple texts
   */
  async batchAnalyze(texts, options = {}) {
    const { batchSize = 5, delayMs = 100 } = options;
    const limitedTexts = texts.slice(0, Math.min(batchSize, 10));
    
    const results = [];
    
    for (let i = 0; i < limitedTexts.length; i++) {
      try {
        const result = await this.analyzeSentiment(limitedTexts[i], options);
        results.push({
          text: limitedTexts[i],
          analysis: result.data,
          success: result.success
        });

        // Add delay between requests to respect rate limits
        if (i < limitedTexts.length - 1) {
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      } catch (error) {
        results.push({
          text: limitedTexts[i],
          analysis: {
            sentiment: 'error',
            confidence: 0,
            emotionalIndicators: [],
            explanation: 'Analysis failed',
            error: error.message
          },
          success: false
        });
      }
    }

    return {
      success: true,
      data: results,
      totalAnalyzed: results.length,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get learning recommendations based on analysis
   */
  async getLearningRecommendations(analysis, userLevel = 'beginner') {
    try {
      const prompt = `Based on this sentiment analysis, provide learning recommendations for a ${userLevel} level student:

Analysis: ${JSON.stringify(analysis)}

Provide 3-5 specific learning recommendations as JSON:
{
  "recommendations": [
    {
      "type": "practice|study|review|challenge",
      "description": "what to do",
      "difficulty": "beginner|intermediate|advanced",
      "estimatedTime": "5-10 minutes"
    }
  ],
  "nextSteps": "overall guidance for improvement"
}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const textResponse = response.text();

      try {
        const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        console.warn('Failed to parse recommendations:', parseError);
      }

      // Fallback recommendations
      return {
        recommendations: [
          {
            type: 'practice',
            description: 'Practice identifying emotional words in different texts',
            difficulty: userLevel,
            estimatedTime: '10-15 minutes'
          }
        ],
        nextSteps: 'Continue practicing with various text examples'
      };

    } catch (error) {
      console.error('Failed to get learning recommendations:', error);
      return {
        recommendations: [],
        nextSteps: 'Continue practicing sentiment analysis'
      };
    }
  }
}

module.exports = GeminiUtils;

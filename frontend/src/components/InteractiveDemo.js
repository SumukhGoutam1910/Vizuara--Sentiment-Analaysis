import React, { useState, useRef } from 'react';
import './InteractiveDemo.css';
import apiService from '../services/apiService';

const InteractiveDemo = ({ onNext, userProgress }) => {
  const [currentExample, setCurrentExample] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const demoHeaderRef = useRef(null);

  const examples = [
    {
      text: "I'm so excited about my birthday party tomorrow!",
      expected: "positive",
      explanation: "AI algorithms detect strong positive indicators: 'excited' (high positive emotion) + 'birthday party' (positive context). The confidence score shows how certain the AI is about this classification."
    },
    {
      text: "This movie was terrible and boring. I hated it.",
      expected: "negative",
      explanation: "The AI identifies multiple negative sentiment markers: 'terrible' (high negative), 'boring' (low negative), and 'hated' (high negative). This creates a strong negative sentiment signal."
    },
    {
      text: "The weather is okay today, nothing special.",
      expected: "neutral",
      explanation: "AI algorithms struggle with neutral sentiment because 'okay' has slight positive connotations while 'nothing special' is slightly negative. The AI must weigh these conflicting signals to determine overall sentiment."
    },
    {
      text: "This movie was so bad it was good!",
      expected: "mixed",
      explanation: "This is a complex case! The AI must understand sarcasm and irony. 'So bad it was good' is a cultural expression where negative words create positive meaning. Advanced algorithms use context and cultural patterns to handle this."
    },
    {
      text: "I'm nervous about the presentation but excited to share my ideas.",
      expected: "mixed",
      explanation: "Mixed emotions challenge AI systems! The algorithm must identify conflicting sentiments ('nervous' = negative, 'excited' = positive) and calculate a weighted score. This requires sophisticated feature extraction and neural network processing."
    }
  ];

  const currentEx = examples[currentExample];

  const analyzeSentiment = async (text) => {
    try {
      console.log('🤖 Calling Gemini AI API for:', text);
      
      // Use the real Gemini AI API
      const result = await apiService.analyzeSentimentWithContext(text, {
        learningLevel: 'beginner',
        includeExamples: true,
        includeTips: true
      });

      console.log('🤖 AI API Response:', result);

      if (result.success && result.data) {
        console.log('✅ AI Analysis successful, using AI results');
        return {
          sentiment: result.data.sentiment || 'neutral',
          score: result.data.confidence || 0,
          positiveWords: result.data.emotionalIndicators ? result.data.emotionalIndicators.filter(word => 
            ['happy', 'excited', 'amazing', 'wonderful', 'great', 'awesome', 'love', 'like', 'good', 'best', 'fantastic', 'brilliant', 'excellent', 'perfect', 'beautiful'].some(positive => 
              word.toLowerCase().includes(positive)
            )
          ).length : 0,
          negativeWords: result.data.emotionalIndicators ? result.data.emotionalIndicators.filter(word => 
            ['sad', 'angry', 'terrible', 'awful', 'hate', 'dislike', 'bad', 'worst', 'horrible', 'disgusting', 'terrible', 'boring', 'annoying', 'frustrated', 'disappointed'].some(negative => 
              word.toLowerCase().includes(negative)
            )
          ).length : 0,
          explanation: result.data.explanation || 'AI analyzed your text and found emotional patterns.',
          examples: result.data.examples || [],
          learningTips: result.data.learningTips || [],
          confidence: result.data.confidence || 0,
          isAI: true,
          rawAIResponse: result.data // Store the full AI response for debugging
        };
      } else {
        console.warn('⚠️ AI API returned success: false, using fallback');
        return analyzeSentimentFallback(text);
      }
    } catch (error) {
      console.error('❌ API call failed, using fallback:', error);
      return analyzeSentimentFallback(text);
    }
  };

  const analyzeSentimentFallback = (text) => {
    // Simple sentiment analysis algorithm as fallback
    const positiveWords = ['happy', 'excited', 'amazing', 'wonderful', 'great', 'awesome', 'love', 'like', 'good', 'best', 'fantastic', 'brilliant', 'excellent', 'perfect', 'beautiful'];
    const negativeWords = ['sad', 'angry', 'terrible', 'awful', 'hate', 'dislike', 'bad', 'worst', 'horrible', 'disgusting', 'terrible', 'boring', 'annoying', 'frustrated', 'disappointed'];
    
    const words = text.toLowerCase().split(/\s+/);
    let positiveScore = 0;
    let negativeScore = 0;
    
    words.forEach(word => {
      if (positiveWords.includes(word)) positiveScore++;
      if (negativeWords.includes(word)) negativeScore++;
    });
    
    const totalScore = positiveScore - negativeScore;
    
    if (totalScore > 0) return { sentiment: 'positive', score: totalScore, positiveWords: positiveScore, negativeWords: negativeScore, isAI: false };
    if (totalScore < 0) return { sentiment: 'negative', score: Math.abs(totalScore), positiveWords: positiveScore, negativeWords: negativeScore, isAI: false };
    return { sentiment: 'neutral', score: 0, positiveWords: positiveScore, negativeWords: negativeScore, isAI: false };
  };

  const handleAnalyze = async () => {
    if (userInput.trim()) {
      setIsAnalyzing(true);
      try {
        const result = await analyzeSentiment(userInput);
        setAnalysisResult(result);
        setShowAnalysis(true);
      } catch (error) {
        console.error('Analysis failed:', error);
        // Show error message to user
        setAnalysisResult({
          sentiment: 'error',
          score: 0,
          positiveWords: 0,
          negativeWords: 0,
          error: 'Analysis failed. Please try again.',
          isAI: false
        });
        setShowAnalysis(true);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const handleNextExample = () => {
    if (currentExample < examples.length - 1) {
      setCurrentExample(currentExample + 1);
      setUserInput('');
      setShowAnalysis(false);
      setAnalysisResult(null);
      
      // Auto-scroll to top of demo when moving to next example
      if (demoHeaderRef.current) {
        demoHeaderRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    } else {
      onNext();
      // Auto-scroll to top when moving to next main section (page-level scroll)
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleTryExample = () => {
    setUserInput(currentEx.text);
    
    // Auto-scroll to the "Now You Try!" interactive section
    const interactiveSection = document.querySelector('.interactive-section');
    if (interactiveSection) {
      interactiveSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  const getSentimentEmoji = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😢';
      case 'neutral': return '😐';
      default: return '🤔';
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '#4CAF50';
      case 'negative': return '#f44336';
      case 'neutral': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  return (
    <div className="demo-container">
      <div className="demo-card card fade-in">
        <div className="demo-header" ref={demoHeaderRef}>
          <h2 className="demo-title">
            🔍 Your First Case: Text Emotion Analysis
          </h2>
          <p className="demo-subtitle">
            Let's see how sentiment analysis works with real examples!
          </p>
          <div className="api-status">
            <span className="status-indicator">🟢</span>
            <span className="status-text">AI Analysis Available</span>
          </div>
        </div>

        <div className="example-section">
          <h3>📝 Example {currentExample + 1}:</h3>
          <div className="example-text">
            "{currentEx.text}"
          </div>
          <div className="example-expected">
            <strong>Expected Emotion:</strong> 
            <span className={`emotion-badge ${currentEx.expected}`}>
              {currentEx.expected.charAt(0).toUpperCase() + currentEx.expected.slice(1)}
            </span>
          </div>
          <p className="example-explanation">{currentEx.explanation}</p>
          
          <button className="btn btn-secondary" onClick={handleTryExample}>
            🧪 Try This Example
          </button>
        </div>

        <div className="interactive-section">
          <h3>🎯 Now You Try!</h3>
          <p>Type any text and see how the computer analyzes the emotions:</p>
          
          <div className="input-group">
            <textarea
              placeholder="Type your message here... (e.g., 'I love ice cream!')"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              rows="4"
              className="sentiment-input"
            />
          </div>
          
          <button 
            className="btn btn-primary"
            onClick={handleAnalyze}
            disabled={!userInput.trim() || isAnalyzing}
          >
            {isAnalyzing ? '🤖 AI is Analyzing...' : '🔍 Analyze Emotions'}
          </button>
        </div>

        {showAnalysis && analysisResult && (
          <div className="analysis-result">
            <h3>📊 Analysis Results:</h3>
            <div className="result-card">
              {/* Compact sentiment display */}
              <div className="sentiment-display compact">
                <span className="sentiment-emoji">
                  {getSentimentEmoji(analysisResult.sentiment)}
                </span>
                <div className="sentiment-info">
                  <h4 style={{ color: getSentimentColor(analysisResult.sentiment) }}>
                    {analysisResult.sentiment.charAt(0).toUpperCase() + analysisResult.sentiment.slice(1)} Sentiment
                  </h4>
                  <div className="score-confidence">
                    <span className="score">Score: {analysisResult.score}</span>
                    {analysisResult.isAI && (
                      <span className="confidence">Confidence: {analysisResult.confidence}%</span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Compact word breakdown */}
              <div className="word-breakdown compact">
                <div className="word-count positive">
                  <span className="word-label">😊 Positive:</span>
                  <span className="word-number">{analysisResult.positiveWords}</span>
                </div>
                <div className="word-count negative">
                  <span className="word-label">😢 Negative:</span>
                  <span className="word-number">{analysisResult.negativeWords}</span>
                </div>
              </div>
              
              {/* Collapsible AI explanation */}
              {analysisResult.isAI ? (
                <div className="ai-explanation compact">
                  <details className="ai-details">
                    <summary className="ai-summary">
                      🤖 AI Analysis Details <span className="expand-icon">▼</span>
                    </summary>
                    <div className="ai-content">
                      <p className="ai-explanation-text">{analysisResult.explanation}</p>
                      
                      {analysisResult.examples && analysisResult.examples.length > 0 && (
                        <div className="ai-examples">
                          <h6>📚 Examples:</h6>
                          <ul>
                            {analysisResult.examples.slice(0, 2).map((example, index) => (
                              <li key={index}>{example}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {analysisResult.learningTips && analysisResult.learningTips.length > 0 && (
                        <div className="ai-tips">
                          <h6>💡 Tips:</h6>
                          <ul>
                            {analysisResult.learningTips.slice(0, 2).map((tip, index) => (
                              <li key={index}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </details>
                </div>
              ) : (
                <div className="fallback-explanation compact">
                  <h5>📊 Basic Analysis</h5>
                  <p>Simple word-based analysis since AI was unavailable.</p>
                </div>
              )}
              
              {/* Compact how-it-works */}
              <div className="how-it-works compact">
                <details className="how-details">
                  <summary className="how-summary">
                    🧠 How It Works <span className="expand-icon">▼</span>
                  </summary>
                  <p>
                    {analysisResult.isAI 
                      ? `Our Gemini AI analyzed your text using deep language understanding! It looked at meaning, context, and emotional patterns to determine sentiment with ${analysisResult.confidence}% confidence.`
                      : "The computer used word-counting: positive words add points, negative words subtract points. The final score determines the overall emotion!"
                    }
                  </p>
                </details>
              </div>
              
              {/* Technical AI Information */}
              <div className="technical-info">
                <details className="tech-details">
                  <summary className="tech-summary">
                    ⚙️ Technical AI Details <span className="expand-icon">▼</span>
                  </summary>
                  <div className="tech-content">
                    <h6>🤖 AI Algorithm Components:</h6>
                    <ul>
                      <li><strong>Neural Networks:</strong> Process complex text patterns and relationships</li>
                      <li><strong>Word Embeddings:</strong> Understand semantic similarities between words</li>
                      <li><strong>Feature Extraction:</strong> Identify emotional indicators and context clues</li>
                      <li><strong>Confidence Scoring:</strong> Measure AI certainty in predictions</li>
                    </ul>
                    
                    <h6>🔍 Sentiment Analysis Challenges:</h6>
                    <ul>
                      <li><strong>Sarcasm Detection:</strong> Understanding when words mean the opposite</li>
                      <li><strong>Context Understanding:</strong> How surrounding words affect meaning</li>
                      <li><strong>Cultural Nuances:</strong> Different expressions across cultures</li>
                      <li><strong>Mixed Emotions:</strong> Handling conflicting sentiments in one text</li>
                    </ul>
                    
                    <h6>📊 AI Confidence Metrics:</h6>
                    <p>The confidence score (0-100%) shows how certain the AI is about its prediction. Higher confidence means the AI found clear emotional indicators, while lower confidence suggests the text is ambiguous or complex.</p>
                  </div>
                </details>
              </div>
            </div>
          </div>
        )}

        <div className="demo-navigation">
          <button 
            className="btn btn-success"
            onClick={handleNextExample}
          >
            {currentExample === examples.length - 1 ? "Continue to Practice! 🎯" : "Next Example ➡️"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InteractiveDemo;

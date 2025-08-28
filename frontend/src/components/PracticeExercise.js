import React, { useState } from 'react';
import './PracticeExercise.css';
import apiService from '../services/apiService';

const PracticeExercise = ({ onNext, updateProgress }) => {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [isAILoading, setIsAILoading] = useState(false);
  const [dragOverCategory, setDragOverCategory] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedWord, setDraggedWord] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchThreshold, setTouchThreshold] = useState(10); // Minimum distance to start dragging

  const exercises = [
    {
      type: 'multiple-choice',
      question: "What is the primary sentiment classification for: 'I'm so excited about my vacation!'",
      options: ['Positive (Confidence: 95%)', 'Negative (Confidence: 5%)', 'Neutral (Confidence: 0%)', 'Mixed (Confidence: 50%)'],
      correct: 0,
      explanation: "AI algorithms detect strong positive indicators: 'excited' (positive emotion) + 'vacation' (positive context). The confidence score shows how certain the AI is about this classification."
    },
    {
      type: 'multiple-choice',
      question: "Which AI algorithm would be best for analyzing this text: 'This movie was terrible and boring'",
      options: ['Naive Bayes Classifier', 'Support Vector Machine (SVM)', 'Neural Network', 'All of the above'],
      correct: 3,
      explanation: "Modern AI systems use ensemble methods combining multiple algorithms. Neural networks excel at understanding context, while SVM and Naive Bayes are great for text classification tasks."
    },
    {
      type: 'ai-analysis',
      question: "Analyze this mixed sentiment text with AI: 'I feel nervous about the presentation but also excited to share my ideas'",
      text: "I feel nervous about the presentation but also excited to share my ideas",
      explanation: "This is a complex sentiment analysis challenge! AI must identify conflicting emotions and calculate a weighted sentiment score. Let's see how advanced algorithms handle this!"
    },
    {
      type: 'drag-drop',
      question: "Categorize these words by their sentiment polarity and intensity:",
      words: ['ecstatic', 'content', 'melancholy', 'furious', 'delighted', 'disappointed'],
      categories: ['High Positive', 'Low Positive', 'High Negative', 'Low Negative'],
      correct: {
        'ecstatic': 'High Positive',
        'content': 'Low Positive',
        'melancholy': 'Low Negative',
        'furious': 'High Negative',
        'delighted': 'High Positive',
        'disappointed': 'Low Negative'
      },
      explanation: "AI sentiment analysis uses polarity (positive/negative) and intensity (high/low) to create more nuanced classifications. This helps AI understand emotional context better!"
    },
    {
      type: 'fill-blank',
      question: "Complete with the most contextually appropriate sentiment word: 'I feel _____ about my test results!'",
      options: ['sad', 'happy', 'angry', 'worried'],
      correct: 1,
      explanation: "AI algorithms consider context clues. Since 'test results' can be positive, 'happy' fits best. This demonstrates how AI uses surrounding words to make predictions."
    },
    {
      type: 'multiple-choice',
      question: "What is the main challenge in sentiment analysis that AI tries to solve?",
      options: ['Understanding sarcasm and irony', 'Counting positive vs negative words', 'Translating languages', 'Generating new text'],
      correct: 0,
      explanation: "Sarcasm and irony are the biggest challenges! AI must understand context, tone, and cultural nuances - not just count positive/negative words. This is why we need advanced algorithms."
    },
    {
      type: 'multiple-choice',
      question: "Which feature extraction method helps AI understand word relationships in sentiment analysis?",
      options: ['Bag of Words', 'Word Embeddings (Word2Vec)', 'Simple counting', 'Random selection'],
      correct: 1,
      explanation: "Word embeddings like Word2Vec help AI understand that 'happy' and 'joyful' are similar, while 'happy' and 'sad' are opposites. This creates better sentiment predictions!"
    },
    {
      type: 'ai-analysis',
      question: "Use AI to analyze this complex text: 'The food was amazing, but the service was terrible. Overall, I had mixed feelings about this restaurant.'",
      text: "The food was amazing, but the service was terrible. Overall, I had mixed feelings about this restaurant.",
      explanation: "This is a multi-aspect sentiment analysis challenge! AI must identify different sentiment targets (food vs service) and combine them into an overall sentiment score. Let's see how AI handles this!"
    }
  ];

  const currentEx = exercises[currentExercise];

  const handleAnswer = (answer) => {
    setUserAnswers(prev => ({ ...prev, [currentExercise]: answer }));
  };

  const handleDragDrop = (word, category) => {
    const currentAnswers = userAnswers[currentExercise] || {};
    setUserAnswers(prev => ({
      ...prev,
      [currentExercise]: { ...currentAnswers, [word]: category }
    }));
  };

  const handleDragStart = (e, word) => {
    e.dataTransfer.setData('text/plain', word);
    e.dataTransfer.effectAllowed = 'move';
    setIsDragging(true);
    setDraggedWord(word);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedWord(null);
    setDragOverCategory(null);
  };

  const handleDragOver = (e, category) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCategory(category);
  };

  const handleDragLeave = (e, category) => {
    e.preventDefault();
    setDragOverCategory(null);
  };

  const handleDrop = (e, category) => {
    e.preventDefault();
    const word = e.dataTransfer.getData('text/plain');
    handleDragDrop(word, category);
    setDragOverCategory(null);
    setIsDragging(false);
    setDraggedWord(null);
  };

  // Touch event handlers for mobile
  const handleTouchStart = (e, word) => {
    if (!userAnswers[currentExercise] || !userAnswers[currentExercise][word]) {
      // Store initial touch position
      const touch = e.touches[0];
      setTouchStartX(touch.clientX);
      setTouchStartY(touch.clientY);
      setDraggedWord(word);
      
      // Don't set isDragging yet - wait for threshold
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleTouchMove = (e) => {
    if (draggedWord && touchStartX !== null && touchStartY !== null) {
      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - touchStartX);
      const deltaY = Math.abs(touch.clientY - touchStartY);
      
      // Check if we've moved enough to start dragging
      if (!isDragging && (deltaX > touchThreshold || deltaY > touchThreshold)) {
        setIsDragging(true);
        
        // Now prevent all default behavior
        e.preventDefault();
        e.stopPropagation();
        
        // Disable scrolling on the entire page
        document.body.style.overflow = 'hidden';
        document.body.style.touchAction = 'none';
        document.body.classList.add('dragging');
        
        // Disable scrolling on the drag container
        const dragExercise = document.querySelector('.drag-drop-exercise');
        if (dragExercise) {
          dragExercise.style.touchAction = 'none';
          dragExercise.style.overflow = 'hidden';
        }
      }
      
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
        
        const touchY = touch.clientY;
        const touchX = touch.clientX;
        
        // Find which category we're hovering over
        const categoryElements = document.querySelectorAll('.category-box');
        categoryElements.forEach((categoryEl, index) => {
          const rect = categoryEl.getBoundingClientRect();
          if (touchY >= rect.top && touchY <= rect.bottom && 
              touchX >= rect.left && touchX <= rect.right) {
            const category = currentEx.categories[index];
            setDragOverCategory(category);
          }
        });
      }
    }
  };

  const handleTouchEnd = (e) => {
    if (isDragging && draggedWord && dragOverCategory) {
      handleDragDrop(draggedWord, dragOverCategory);
    }
    
    // Restore all scrolling
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
    document.body.classList.remove('dragging');
    
    const dragExercise = document.querySelector('.drag-drop-exercise');
    if (dragExercise) {
      dragExercise.style.touchAction = '';
      dragExercise.style.overflow = '';
    }
    
    // Reset all states
    setIsDragging(false);
    setDraggedWord(null);
    setDragOverCategory(null);
    setTouchStartX(null);
    setTouchStartY(null);
  };

  const handleTouchCancel = () => {
    // Restore all scrolling
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
    document.body.classList.remove('dragging');
    
    const dragExercise = document.querySelector('.drag-drop-exercise');
    if (dragExercise) {
      dragExercise.style.touchAction = '';
      dragExercise.style.overflow = '';
    }
    
    // Reset all states
    setIsDragging(false);
    setDraggedWord(null);
    setDragOverCategory(null);
    setTouchStartX(null);
    setTouchStartY(null);
  };

  const handleRemoveWord = (word) => {
    const currentAnswers = userAnswers[currentExercise] || {};
    const newAnswers = { ...currentAnswers };
    delete newAnswers[word];
    setUserAnswers(prev => ({
      ...prev,
      [currentExercise]: newAnswers
    }));
  };

  // Touch-friendly alternative for mobile devices
  const handleTouchCategorize = (word) => {
    if (!userAnswers[currentExercise] || !userAnswers[currentExercise][word]) {
      // Auto-categorize to the first available category
      const firstCategory = currentEx.categories[0];
      handleDragDrop(word, firstCategory);
    }
  };

  const handleAIAnalysis = async (text) => {
    setIsAILoading(true);
    try {
      const result = await apiService.analyzeSentimentWithContext(text, {
        learningLevel: 'beginner',
        includeExamples: true,
        includeTips: true
      });

      if (result.success) {
        setUserAnswers(prev => ({
          ...prev,
          [currentExercise]: {
            sentiment: result.data.sentiment,
            confidence: result.data.confidence,
            explanation: result.data.explanation,
            isAI: true
          }
        }));
      } else {
        console.error('AI analysis failed:', result);
      }
    } catch (error) {
      console.error('Error in AI analysis:', error);
    } finally {
      setIsAILoading(false);
    }
  };

  const checkAnswers = () => {
    // Check if this is the last exercise
    if (currentExercise === exercises.length - 1) {
      // Last exercise - calculate final score and show results
      let correctCount = 0;
      
      exercises.forEach((exercise, index) => {
        const userAnswer = userAnswers[index];
        if (exercise.type === 'multiple-choice' || exercise.type === 'fill-blank') {
          if (userAnswer === exercise.correct) correctCount++;
        } else if (exercise.type === 'drag-drop') {
          const isCorrect = Object.keys(exercise.correct).every(word => 
            userAnswer && userAnswer[word] === exercise.correct[word]
          );
          if (isCorrect) correctCount++;
        } else if (exercise.type === 'ai-analysis') {
          // AI analysis exercises are considered correct if they have a result
          if (userAnswer && userAnswer.sentiment) correctCount++;
        }
      });

      const finalScore = Math.round((correctCount / exercises.length) * 100);
      setScore(finalScore);
      setShowResults(true);
      
      // Update progress
      updateProgress({ 
        exerciseScores: [...(updateProgress.exerciseScores || []), finalScore] 
      });
    } else {
      // Not the last exercise - move to next question
      setCurrentExercise(currentExercise + 1);
    }
  };

  const handleNext = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
    } else {
      onNext();
    }
  };

  const renderExercise = () => {
    switch (currentEx.type) {
      case 'multiple-choice':
      case 'fill-blank':
        return (
          <div className="exercise-options">
            {currentEx.options.map((option, index) => (
              <button
                key={index}
                className={`option-btn ${userAnswers[currentExercise] === index ? 'selected' : ''}`}
                onClick={() => handleAnswer(index)}
              >
                {option}
              </button>
            ))}
          </div>
        );

      case 'ai-analysis':
        return (
          <div className="ai-analysis-exercise">
            <div className="text-to-analyze">
              <h4>📝 Text to analyze:</h4>
              <div className="analysis-text">
                "{currentEx.text}"
              </div>
            </div>
            
            <div className="ai-analysis-section">
              <p className="ai-instruction">
                Click the button below to see how AI analyzes this text using advanced sentiment analysis!
              </p>
              
              <button 
                className="btn btn-primary ai-analyze-btn"
                onClick={() => handleAIAnalysis(currentEx.text)}
                disabled={isAILoading}
              >
                {isAILoading ? (
                  <>
                    <span className="spinner"></span>
                    Analyzing with AI...
                  </>
                ) : (
                  '🤖 Analyze with AI'
                )}
              </button>
              
              {userAnswers[currentExercise] && (
                <div className="ai-result">
                  <h5>🤖 AI Analysis Result:</h5>
                  <div className="ai-sentiment">
                    <span className="sentiment-badge">
                      {userAnswers[currentExercise].sentiment}
                    </span>
                    <span className="confidence">
                      Confidence: {userAnswers[currentExercise].confidence}%
                    </span>
                  </div>
                  <p className="ai-explanation">
                    {userAnswers[currentExercise].explanation}
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 'drag-drop':
        const userAnswer = userAnswers[currentExercise] || {};
        return (
          <div className={`drag-drop-exercise ${isDragging ? 'dragging' : ''}`}>
            <div className="mobile-instruction">
              <strong>📱 Mobile Users:</strong> Tap and hold words, then drag to categories!
            </div>
            <div className="words-container">
              <h4>Words to categorize:</h4>
              <div className="words-list">
                {currentEx.words.map(word => {
                  const isCategorized = userAnswer[word];
                  return (
                    <span 
                      key={word} 
                      className={`word-tag ${isCategorized ? 'categorized' : 'draggable'} ${isDragging && draggedWord === word ? 'dragging' : ''}`}
                      draggable={!isCategorized}
                      onDragStart={(e) => !isCategorized && handleDragStart(e, word)}
                      onDragEnd={handleDragEnd}
                      onTouchStart={(e) => !isCategorized && handleTouchStart(e, word)}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                      onTouchCancel={handleTouchCancel}
                      onTouchStartCapture={(e) => !isCategorized && e.preventDefault()}
                      onTouchMoveCapture={(e) => isDragging && e.preventDefault()}
                      title={!isCategorized ? "Drag to categorize or tap to auto-categorize" : "Already categorized"}
                    >
                      {word}
                    </span>
                  );
                })}
              </div>
            </div>
            
            <div className="categories-container">
              {currentEx.categories.map(category => (
                <div key={category} className="category-box">
                  <h4>{category}</h4>
                  <div className="category-words">
                    {Object.entries(userAnswer)
                      .filter(([_, cat]) => cat === category)
                      .map(([word, _]) => (
                        <span 
                          key={word} 
                          className="categorized-word"
                          draggable={true}
                          onDragStart={(e) => handleDragStart(e, word)}
                        >
                          {word}
                          <button 
                            className="remove-word-btn"
                            onClick={() => handleRemoveWord(word)}
                            title="Remove word"
                          >
                            ×
                          </button>
                        </span>
                      ))
                    }
                  </div>
                  <div 
                    className={`drop-zone ${dragOverCategory === category ? 'drag-over' : ''}`}
                    onDragOver={(e) => handleDragOver(e, category)}
                    onDragLeave={(e) => handleDragLeave(e, category)}
                    onDrop={(e) => handleDrop(e, category)}
                    onTouchStart={(e) => handleTouchStart(e, '')}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onTouchCancel={handleTouchCancel}
                    onTouchMoveCapture={(e) => isDragging && e.preventDefault()}
                  >
                    {Object.entries(userAnswer).filter(([_, cat]) => cat === category).length === 0 ? (
                      <span>Drop words here</span>
                    ) : (
                      <span>Drop more words here</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (showResults) {
    return (
      <div className="exercise-container">
        <div className="exercise-card card fade-in">
          <h2 className="results-title">🎯 Exercise Results!</h2>
          
          <div className="score-display">
            <div className="score-circle">
              <span className="score-number">{score}</span>
              <span className="score-percent">%</span>
            </div>
            <h3>Great job, Detective!</h3>
            <p>You got {score}% of the questions correct!</p>
          </div>

          <div className="exercise-review">
            <h4>📝 Review Your Answers:</h4>
            {exercises.map((exercise, index) => {
              const userAnswer = userAnswers[index];
              let isCorrect = false;
              
              if (exercise.type === 'multiple-choice' || exercise.type === 'fill-blank') {
                isCorrect = userAnswer === exercise.correct;
              } else if (exercise.type === 'drag-drop') {
                isCorrect = Object.keys(exercise.correct).every(word => 
                  userAnswer && userAnswer[word] === exercise.correct[word]
                );
              } else if (exercise.type === 'ai-analysis') {
                isCorrect = userAnswer && userAnswer.sentiment;
              }

              return (
                <div key={index} className={`review-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                  <div className="review-header">
                    <span className="review-icon">
                      {isCorrect ? '✅' : '❌'}
                    </span>
                    <span className="review-question">
                      Question {index + 1}: {exercise.question}
                    </span>
                  </div>
                  <p className="review-explanation">{exercise.explanation}</p>
                </div>
              );
            })}
          </div>

          <button className="btn btn-success" onClick={handleNext}>
            🚀 Continue to Final Challenge!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="exercise-container">
      <div className="exercise-card card fade-in">
        <div className="exercise-header">
          <h2 className="exercise-title">
            🎯 Practice Makes Perfect!
          </h2>
          <p className="exercise-subtitle">
            Test your detective skills with these exercises!
          </p>
          <div className="exercise-progress">
            Exercise {currentExercise + 1} of {exercises.length}
          </div>
        </div>

        <div className="exercise-content">
          <div className="question-section">
            <h3 className="question-text">{currentEx.question}</h3>
            {renderExercise()}
          </div>

          <div className="exercise-navigation">
            {userAnswers[currentExercise] !== undefined && (
              <button className="btn btn-primary" onClick={checkAnswers}>
                {currentExercise === exercises.length - 1 ? '🎯 Check Final Results!' : '➡️ Next Question'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeExercise;

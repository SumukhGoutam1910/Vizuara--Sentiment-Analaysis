import React, { useState } from 'react';
import './FinalChallenge.css';

const FinalChallenge = ({ onNext, updateProgress, userProgress }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  const finalQuestions = [
    {
      type: 'sentiment-analysis',
      text: "I absolutely love this new restaurant! The food is amazing and the service is incredible. Best dining experience ever!",
      options: ['Very Positive', 'Positive', 'Neutral', 'Negative', 'Very Negative'],
      correct: 0,
      explanation: "Words like 'absolutely love', 'amazing', 'incredible', and 'best' indicate very strong positive emotions!"
    },
    {
      type: 'sentiment-analysis',
      text: "This movie was okay, nothing special. I didn't hate it but I wouldn't watch it again either.",
      options: ['Very Positive', 'Positive', 'Neutral', 'Negative', 'Very Negative'],
      correct: 2,
      explanation: "Words like 'okay' and 'nothing special' are neutral, while 'didn't hate' shows lack of strong negative emotion."
    },
    {
      type: 'sentiment-analysis',
      text: "I'm so frustrated with this terrible customer service. This is the worst experience I've ever had!",
      options: ['Very Positive', 'Positive', 'Neutral', 'Negative', 'Very Negative'],
      correct: 4,
      explanation: "Words like 'frustrated', 'terrible', 'worst' indicate very strong negative emotions."
    },
    {
      type: 'word-categorization',
      question: "Which of these words would make a text sound more positive?",
      words: ['fantastic', 'horrible', 'wonderful', 'terrible', 'amazing'],
      correct: ['fantastic', 'wonderful', 'amazing'],
      explanation: "Positive words like 'fantastic', 'wonderful', and 'amazing' make text sound happier and more enthusiastic!"
    },
    {
      type: 'real-world-application',
      question: "Imagine you're helping a company understand customer feedback. A customer writes: 'The product is great but delivery was slow.' How would you classify this?",
      options: ['Positive (focus on the good)', 'Negative (focus on the problem)', 'Mixed (both positive and negative)', 'Neutral (balanced)'],
      correct: 2,
      explanation: "This is a mixed sentiment - positive about the product but negative about delivery. Real feedback often contains both emotions!"
    }
  ];

  const currentQ = finalQuestions[currentQuestion];

  // Timer effect
  React.useEffect(() => {
    if (timeLeft > 0 && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResults) {
      handleSubmit();
    }
  }, [timeLeft, showResults]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (answer) => {
    setUserAnswers(prev => ({ ...prev, [currentQuestion]: answer }));
  };

  const handleWordSelection = (word) => {
    const currentAnswers = userAnswers[currentQuestion] || [];
    if (currentAnswers.includes(word)) {
      setUserAnswers(prev => ({
        ...prev,
        [currentQuestion]: currentAnswers.filter(w => w !== word)
      }));
    } else {
      setUserAnswers(prev => ({
        ...prev,
        [currentQuestion]: [...currentAnswers, word]
      }));
    }
  };

  const handleSubmit = () => {
    let correctCount = 0;
    
    finalQuestions.forEach((question, index) => {
      const userAnswer = userAnswers[index];
      if (question.type === 'sentiment-analysis' || question.type === 'real-world-application') {
        if (userAnswer === question.correct) correctCount++;
      } else if (question.type === 'word-categorization') {
        const isCorrect = question.correct.every(word => userAnswer && userAnswer.includes(word)) &&
                         userAnswer && userAnswer.length === question.correct.length;
        if (isCorrect) correctCount++;
      }
    });

    const score = Math.round((correctCount / finalQuestions.length) * 100);
    setFinalScore(score);
    setShowResults(true);
    
    updateProgress({ finalScore: score });
  };

  const handleNext = () => {
    if (currentQuestion < finalQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const renderQuestion = () => {
    switch (currentQ.type) {
      case 'sentiment-analysis':
        return (
          <div className="question-content">
            <div className="text-to-analyze">
              <h4>Analyze this text:</h4>
              <div className="text-content">"{currentQ.text}"</div>
            </div>
            
            <div className="answer-options">
              <h4>What emotion does this text show?</h4>
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  className={`answer-btn ${userAnswers[currentQuestion] === index ? 'selected' : ''}`}
                  onClick={() => handleAnswer(index)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );

      case 'word-categorization':
        const userAnswer = userAnswers[currentQuestion] || [];
        return (
          <div className="question-content">
            <h4>{currentQ.question}</h4>
            <div className="word-selection">
              {currentQ.words.map(word => (
                <button
                  key={word}
                  className={`word-select-btn ${userAnswer.includes(word) ? 'selected' : ''}`}
                  onClick={() => handleWordSelection(word)}
                >
                  {word}
                </button>
              ))}
            </div>
            <p className="instruction">Click on the positive words that would make text sound happier.</p>
          </div>
        );

      case 'real-world-application':
        return (
          <div className="question-content">
            <h4>{currentQ.question}</h4>
            <div className="answer-options">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  className={`answer-btn ${userAnswers[currentQuestion] === index ? 'selected' : ''}`}
                  onClick={() => handleAnswer(index)}
                >
                  {option}
                </button>
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
      <div className="challenge-container">
        <div className="challenge-card card fade-in">
          <h2 className="challenge-title">🏆 Final Challenge Complete!</h2>
          
          <div className="final-score-display">
            <div className="final-score-circle">
              <span className="final-score-number">{finalScore}</span>
              <span className="final-score-percent">%</span>
            </div>
            <h3>Congratulations, Detective {userProgress.name}!</h3>
            <p>You've completed your training in Sentiment Analysis!</p>
          </div>

          <div className="performance-summary">
            <h4>📊 Your Performance Summary:</h4>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="summary-icon">🎯</span>
                <span className="summary-label">Final Challenge Score</span>
                <span className="summary-value">{finalScore}%</span>
              </div>
              <div className="summary-item">
                <span className="summary-icon">⏱️</span>
                <span className="summary-label">Time Remaining</span>
                <span className="summary-value">{formatTime(timeLeft)}</span>
              </div>
              <div className="summary-item">
                <span className="summary-icon">📝</span>
                <span className="summary-label">Questions Completed</span>
                <span className="summary-value">{finalQuestions.length}/{finalQuestions.length}</span>
              </div>
            </div>
          </div>

          <div className="achievement-badge">
            <span className="badge-icon">🎖️</span>
            <div className="badge-content">
              <h5>Emotion Detective Certificate</h5>
              <p>You've successfully learned how computers understand emotions in text!</p>
            </div>
          </div>

          <button className="btn btn-success" onClick={onNext}>
            🎉 Get Your Certificate!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="challenge-container">
      <div className="challenge-card card fade-in">
        <div className="challenge-header">
          <h2 className="challenge-title">
            🏆 The Final Challenge
          </h2>
          <p className="challenge-subtitle">
            Time to prove you're a true Emotion Detective!
          </p>
          
          <div className="challenge-info">
            <div className="timer">
              <span className="timer-icon">⏱️</span>
              <span className="timer-text">Time Left: {formatTime(timeLeft)}</span>
            </div>
            <div className="progress">
              Question {currentQuestion + 1} of {finalQuestions.length}
            </div>
          </div>
        </div>

        <div className="challenge-content">
          {renderQuestion()}
        </div>

        <div className="challenge-navigation">
          {userAnswers[currentQuestion] !== undefined && (
            <button className="btn btn-primary" onClick={handleNext}>
              {currentQuestion === finalQuestions.length - 1 ? "Submit Final Answers! 🎯" : "Next Question ➡️"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinalChallenge;

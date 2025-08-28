import React, { useState, useEffect, useRef } from 'react';
import './TutorialGuide.css';

const TutorialGuide = ({ currentStep, onNext, onPrevious, userProgress }) => {
  const [currentTutorialStep, setCurrentTutorialStep] = useState(0);
  const [showSpeechBubble, setShowSpeechBubble] = useState(true);
  const tutorialHeaderRef = useRef(null);

  const tutorialSteps = [
    {
      step: 0,
      title: "Welcome! 👋",
      character: "👩‍🏫",
      message: "Hi! I'm Professor Emma. Let's learn about emotions in text!",
      tip: "We'll make it fun and easy to understand!"
    },
    {
      step: 1,
      title: "What We'll Learn 🎯",
      character: "🤖",
      message: "We'll teach computers to understand if text is happy 😊, sad 😢, or neutral 😐",
      tip: "Just like you can tell when someone is happy or sad!"
    },
    {
      step: 2,
      title: "Ready to Start? 🚀",
      character: "🕵️‍♀️",
      message: "You'll be an emotion detective! Let's begin with a fun story!",
      tip: "You're going to be amazing at this!"
    }
  ];

  const currentTutorial = tutorialSteps[currentTutorialStep];

  useEffect(() => {
    // Show speech bubble with animation
    setShowSpeechBubble(false);
    setTimeout(() => setShowSpeechBubble(true), 100);
    
    // Auto-scroll to top of tutorial when step changes
    if (tutorialHeaderRef.current) {
      tutorialHeaderRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }, [currentTutorialStep]);

  const handleNext = () => {
    if (currentTutorialStep < tutorialSteps.length - 1) {
      setCurrentTutorialStep(prev => prev + 1);
      // Auto-scroll to top of tutorial when moving to next step
      if (tutorialHeaderRef.current) {
        tutorialHeaderRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    } else {
      // Tutorial complete, move to next main step
      onNext();
      // Auto-scroll to top when moving to next main section
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentTutorialStep > 0) {
      setCurrentTutorialStep(prev => prev - 1);
      // Auto-scroll to top of tutorial when going to previous step
      if (tutorialHeaderRef.current) {
        tutorialHeaderRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    } else {
      onPrevious();
      // Auto-scroll to top when going to previous main section
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSkip = () => {
    onNext();
    // Auto-scroll to top when skipping tutorial (moving to next main section)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="tutorial-guide">
      <div className="tutorial-container">
        {/* Header */}
        <div className="tutorial-header" ref={tutorialHeaderRef}>
          <h1>🎓 Quick Training</h1>
          <div className="tutorial-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${((currentTutorialStep + 1) / tutorialSteps.length) * 100}%` }}
              />
            </div>
            <span className="progress-text">
              Step {currentTutorialStep + 1} of {tutorialSteps.length}
            </span>
          </div>
        </div>

        {/* Main Tutorial Content */}
        <div className="tutorial-content">
          {/* Character */}
          <div className="character-section">
            <div className="character-avatar">
              {currentTutorial.character}
            </div>
          </div>

          {/* Speech Bubble */}
          <div className={`speech-bubble ${showSpeechBubble ? 'show' : ''}`}>
            <div className="bubble-content">
              <h3>{currentTutorial.title}</h3>
              <p className="character-message">{currentTutorial.message}</p>
              <div className="tip-box">
                <span className="tip-icon">💡</span>
                <span className="tip-text">{currentTutorial.tip}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="tutorial-navigation">
          <button 
            className="btn btn-secondary" 
            onClick={handlePrevious}
            disabled={currentTutorialStep === 0}
          >
            ← Previous
          </button>
          
          <button 
            className="btn btn-secondary" 
            onClick={handleSkip}
          >
            Skip
          </button>
          
          <button 
            className="btn btn-primary" 
            onClick={handleNext}
          >
            {currentTutorialStep === tutorialSteps.length - 1 ? 'Start! 🚀' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorialGuide;

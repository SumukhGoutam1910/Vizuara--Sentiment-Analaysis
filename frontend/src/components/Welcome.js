import React, { useState } from 'react';
import './Welcome.css';
import InteractiveCard, { StoryCard, CharacterCard } from './InteractiveCard';

const Welcome = ({ onNext, updateProgress }) => {
  const [name, setName] = useState('');
  const [isNameValid, setIsNameValid] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleNameChange = (e) => {
    const value = e.target.value.trim();
    setName(value);
    setIsNameValid(value.length >= 2);
  };

  const handleStart = () => {
    if (isNameValid) {
      updateProgress({ name });
      onNext();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && isNameValid) {
      handleStart();
    }
  };

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <StoryCard chapter="0" className="welcome-story-card">
          <h2>🌟 Welcome to the Most Amazing Adventure! 🌟</h2>
          <p>
            Hello, young detective! You're about to embark on an incredible journey 
            into the mysterious world of <strong>Sentiment Analysis</strong> - where 
            we teach computers to understand human emotions! 🚀
          </p>
          
          <div className="mission-preview">
            <h3>🎯 Your Mission:</h3>
            <p>
              Help the citizens of <strong>Textville</strong> by learning how to 
              detect emotions in messages. You'll become an expert at understanding 
              whether people are happy, sad, or just neutral! 🕵️‍♀️
            </p>
          </div>
        </StoryCard>

        <div className="character-introductions">
          <CharacterCard 
            character="happyHelper"
            emotion="😊"
            message="Hi there! I'm Happy Helper, and I'll be your guide through this amazing journey!"
            className="character-intro-card"
          />
          
          <CharacterCard 
            character="curiousCat"
            emotion="😺"
            message="Meow! I'm Curious Cat, and I love asking questions that make you think deeper!"
            className="character-intro-card"
          />
        </div>

        <InteractiveCard className="learning-objectives-card" glow={true}>
          <h3>🎓 What You'll Learn:</h3>
          <div className="objectives-grid">
            <div className="objective-item">
              <span className="objective-icon">🔍</span>
              <span>How to analyze text for emotions</span>
            </div>
            <div className="objective-item">
              <span className="objective-icon">🎮</span>
              <span>Play fun games to practice skills</span>
            </div>
            <div className="objective-item">
              <span className="objective-icon">🏆</span>
              <span>Earn badges and achievements</span>
            </div>
            <div className="objective-item">
              <span className="objective-icon">🌟</span>
              <span>Become an Emotion Detective!</span>
            </div>
          </div>
        </InteractiveCard>

        <InteractiveCard className="name-input-card" glow={true}>
          <h3>🕵️‍♀️ Detective Identity Setup</h3>
          <p>Enter your name to begin your detective training:</p>
          
          <div className="input-group">
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              onKeyPress={handleKeyPress}
              placeholder="Enter your detective name..."
              className={`name-input ${isNameValid ? 'valid' : ''}`}
              maxLength={20}
            />
            <div className="input-feedback">
              {name.length > 0 && (
                <span className={`feedback ${isNameValid ? 'positive' : 'negative'}`}>
                  {isNameValid ? '✅ Perfect name!' : '❌ Name too short (min 2 characters)'}
                </span>
              )}
            </div>
          </div>

          <button
            className={`btn btn-primary start-button ${!isNameValid ? 'disabled' : ''}`}
            onClick={handleStart}
            disabled={!isNameValid}
          >
            🚀 Start My Detective Journey!
          </button>
        </InteractiveCard>

        <InteractiveCard className="preview-card" glow={true}>
          <h3>🎬 Story Preview</h3>
          <p>Get a sneak peek at what's coming:</p>
          
          <div className="preview-content">
            <div className="preview-chapter">
              <span className="chapter-number">1</span>
              <span className="chapter-title">The Mystery of Textville</span>
            </div>
            <div className="preview-chapter">
              <span className="chapter-number">2</span>
              <span className="chapter-title">Your First Case</span>
            </div>
            <div className="preview-chapter">
              <span className="chapter-number">3</span>
              <span className="chapter-title">Practice & Challenges</span>
            </div>
            <div className="preview-chapter">
              <span className="chapter-number">4</span>
              <span className="chapter-title">Graduation Day!</span>
            </div>
          </div>
        </InteractiveCard>
      </div>
    </div>
  );
};

export default Welcome;

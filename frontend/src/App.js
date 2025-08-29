import React, { useState, useEffect } from 'react';
import './App.css';
import Welcome from './components/Welcome';
import TutorialGuide from './components/TutorialGuide';
import StoryChapter from './components/StoryChapter';
import InteractiveDemo from './components/InteractiveDemo';
import PracticeExercise from './components/PracticeExercise';
import FinalChallenge from './components/FinalChallenge';
import Conclusion from './components/Conclusion';
import EmotionCatchGame from './components/EmotionCatchGame';
import ParticleSystem from './components/ParticleSystem';
import MagicalBackground from './components/MagicalBackground';
import FloatingCharacter from './components/FloatingCharacter';
import InteractiveCard, { StoryCard, ExerciseCard, AchievementCard, CharacterCard } from './components/InteractiveCard';
import Notification from './components/Notification';
import BackgroundMusic from './components/BackgroundMusic';
import apiService from './services/apiService';
import soundManager, { playButtonClick } from './utils/soundUtils';

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [userProgress, setUserProgress] = useState({
    name: '',
    completedChapters: [],
    exerciseScores: [],
    finalScore: 0,
    achievements: [],
    gameScore: 0
  });
  const [currentTheme, setCurrentTheme] = useState('default');
  const [showGame, setShowGame] = useState(false);
  const [floatingCharacters, setFloatingCharacters] = useState([]);
  const [apiStatus, setApiStatus] = useState('checking');
  const [showProjectsDropdown, setShowProjectsDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const steps = [
    { component: Welcome, title: "Welcome to Emotion Detective!", theme: 'story' },
    { component: TutorialGuide, title: "Detective Training Tutorial", theme: 'story' },
    { component: StoryChapter, title: "Chapter 1: The Mystery of Feelings", theme: 'story' },
    { component: InteractiveDemo, title: "Your First Case: Text Emotion Analysis", theme: 'positive' },
    { component: PracticeExercise, title: "Practice Makes Perfect!", theme: 'game' },
    { component: FinalChallenge, title: "The Final Challenge", theme: 'celebration' },
    { component: Conclusion, title: "Congratulations, Detective!", theme: 'celebration' }
  ];

  // Initialize floating characters
  useEffect(() => {
    const characters = [
      { type: 'happyHelper', position: 'random', behavior: 'float' },
      { type: 'curiousCat', position: 'random', behavior: 'bounce' },
      { type: 'wiseOwl', position: 'random', behavior: 'rotate' },
      { type: 'magicWizard', position: 'random', behavior: 'float' }
    ];
    setFloatingCharacters(characters);
  }, []);

  // Update theme based on current step
  useEffect(() => {
    const step = steps[currentStep];
    if (step && step.theme) {
      setCurrentTheme(step.theme);
    }
  }, [currentStep]);

  // Check API connection status
  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        const health = await apiService.healthCheck();
        if (health.status === 'OK') {
          setApiStatus('connected');
        } else {
          setApiStatus('error');
        }
      } catch (error) {
        console.error('API connection failed:', error);
        setApiStatus('error');
      }
    };

    checkApiConnection();
  }, []);

  // Initialize notifications
  useEffect(() => {
    setNotifications([
      {
        message: "Due to free use of render the Gemini API calls may get delayed due to instance spin down after inactivity!",
        type: "red"
      },
      {
        message: "Music Player auto start removed for optimisation.",
        type: "blue"
      }
    ]);
  }, []);

  const goToNext = () => {
    playButtonClick();
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPrevious = () => {
    playButtonClick();
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateProgress = (newData) => {
    setUserProgress(prev => ({
      ...prev,
      ...newData
    }));
  };

  const handleGameComplete = (score) => {
    updateProgress({ gameScore: score });
    setShowGame(false);
  };

  const toggleGame = () => {
    playButtonClick();
    setShowGame(!showGame);
  };

  const getProgressPercentage = () => {
    return ((currentStep + 1) / steps.length) * 100;
  };

  // Projects data for the dropdown
  const projects = [
    {
      name: "Karnaugh Map Solver",
      description: "A tool for Electronics engineers to solve Karnaugh maps for boolean algebra",
      status: "Active",
      tech: "Python, Flask, JS, HTML, CSS",
      url: "https://kmapsolver.com",
    },
    {
      name: "ECE Department Website",
      description: "A website for the ECE Department of the PICT college",
      status: "In Development",
      tech: "React, Node.js, MongoDB, CSS",
      url: "#",
    },
    {
      name: "Smart Biometric Attendance System",
      description: "A system for biometric attendance using fingerprint integrated with a smart web dashboard",
      status: "Completed",
      tech: "React, Node.js, MongoDB, CSS, Embedded C",
      url: "#",
    },
  ];

  const toggleProjectsDropdown = () => {
    playButtonClick();
    setShowProjectsDropdown(!showProjectsDropdown);
  };

  const CurrentComponent = steps[currentStep].component;

  return (
    <div className="App">
              {/* Notification */}
        <Notification
          notifications={notifications}
          onClose={(index) => {
            setNotifications(prev => prev.filter((_, i) => i !== index));
          }}
        />

      {/* Background Music */}
      <BackgroundMusic />

      {/* Magical Background */}
      <MagicalBackground
        theme={currentTheme}
        progress={getProgressPercentage()}
        isActive={true}
      />

      {/* Particle System */}
      <ParticleSystem theme={currentTheme} />

      {/* Floating Characters */}
      {floatingCharacters.map((char, index) => (
        <FloatingCharacter
          key={index}
          character={char.type}
          position={char.position}
          behavior={char.behavior}
          onClick={() => {
            playButtonClick();
            // Add achievement or bonus when characters are clicked
            if (!userProgress.achievements.includes(`${char.type}Clicked`)) {
              updateProgress({
                achievements: [...userProgress.achievements, `${char.type}Clicked`]
              });
            }
          }}
        />
      ))}

      <header className="app-header">
        <div className="header-content">
          <div className="title-section">
            <h1 className="app-title">
              🕵️‍♀️ Emotion Detective
            </h1>
            <p className="app-subtitle">
              Sentiment Analysis Adventure
            </p>
          </div>

          <div className="progress-section">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
            <span className="progress-text">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>

          <div className="header-actions">
            <div className="api-status">
              <span className={`status-indicator ${apiStatus}`}>
                {apiStatus === 'connected' ? '🤖 AI Connected' : 
                 apiStatus === 'checking' ? '⏳ Checking...' : '❌ AI Offline'}
              </span>
            </div>
            
            <button
              className="btn btn-secondary sound-toggle"
              onClick={() => {
                playButtonClick();
                soundManager.toggleSound();
              }}
              title={soundManager.isSoundOn() ? "Disable Button Sounds" : "Enable Button Sounds"}
            >
              {soundManager.isSoundOn() ? '🔊' : '🔇'}
            </button>
            
            <button
              className="btn btn-secondary game-toggle"
              onClick={toggleGame}
            >
              🎮 Mini-Game
            </button>

            {currentStep > 0 && (
              <button
                className="btn btn-secondary"
                onClick={goToPrevious}
              >
                ← Previous
              </button>
            )}

            {currentStep < steps.length - 1 && (
              <button
                className="btn btn-primary"
                onClick={goToNext}
              >
                Next →
              </button>
            )}
          </div>

          {/* Projects Dropdown - Positioned at top right */}
          <div className="projects-dropdown">
            <button
              className="cyberpunk-projects-toggle"
              onClick={toggleProjectsDropdown}
              title="View My Other Projects"
            >
              <span className="cyberpunk-text">PROJECTS</span>
              <span className="cyberpunk-glow"></span>
            </button>
            
            {showProjectsDropdown && (
              <div className="cyberpunk-projects-menu">
                <div className="cyberpunk-projects-header">
                  <h3 className="cyberpunk-title">🚀 MY PROJECTS</h3>
                  <button 
                    className="cyberpunk-close"
                    onClick={() => {
                      playButtonClick();
                      toggleProjectsDropdown();
                    }}
                    title="Close Projects Menu"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="cyberpunk-projects-list">
                  {projects.map((project, index) => (
                    <div key={index} className="cyberpunk-project-item">
                      <div className="cyberpunk-project-icon">{project.icon}</div>
                      <div className="cyberpunk-project-info">
                        <h4 className="cyberpunk-project-name">{project.name}</h4>
                        <p className="cyberpunk-project-description">{project.description}</p>
                        <div className="cyberpunk-project-meta">
                          <span className={`cyberpunk-project-status ${project.status.toLowerCase().replace(' ', '-')}`}>
                            {project.status}
                          </span>
                          <span className="cyberpunk-project-tech">{project.tech}</span>
                        </div>
                      </div>
                      <a 
                        href={project.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="cyberpunk-project-link"
                        title={`View ${project.name} on GitHub`}
                      >
                        🔗
                      </a>
                    </div>
                  ))}
                </div>
                
                <div className="cyberpunk-projects-footer">
                  <a 
                    href="https://github.com/yourusername" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="cyberpunk-view-all"
                  >
                    👀 VIEW ALL PROJECTS ON GITHUB
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="app-main">
        {showGame ? (
          <div className="game-overlay">
            <EmotionCatchGame
              onComplete={handleGameComplete}
              difficulty="easy"
            />
            <button
              className="btn btn-secondary close-game"
              onClick={() => {
                playButtonClick();
                toggleGame();
              }}
            >
              ✕ Close Game
            </button>
          </div>
        ) : (
          <CurrentComponent
            onNext={goToNext}
            onPrevious={goToPrevious}
            userProgress={userProgress}
            updateProgress={updateProgress}
            currentStep={currentStep}
          />
        )}
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p>Made with ❤️ for young learners by Sumukh Goutam | Learn Sentiment Analysis through storytelling</p>
          <div className="footer-achievements">
            {userProgress.achievements.length > 0 && (
              <div className="achievement-badges">
                {userProgress.achievements.map((achievement, index) => (
                  <span key={index} className="achievement-badge">
                    {achievement === 'happyHelperClicked' && '😊'}
                    {achievement === 'curiousCatClicked' && '😺'}
                    {achievement === 'wiseOwlClicked' && '🦉'}
                    {achievement === 'magicWizardClicked' && '🧙‍♂️'}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

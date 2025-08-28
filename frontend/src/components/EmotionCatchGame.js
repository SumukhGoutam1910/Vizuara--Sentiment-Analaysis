import React, { useState, useEffect, useRef } from 'react';
import './EmotionCatchGame.css';

const EmotionCatchGame = ({ onComplete, difficulty = 'easy' }) => {
  const [gameState, setGameState] = useState('ready'); // ready, playing, paused, gameOver, won
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [fallingWords, setFallingWords] = useState([]);
  const [basketPosition, setBasketPosition] = useState(50);
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  const [scorePopup, setScorePopup] = useState(null); // For score popup animation
  const [catchEffect, setCatchEffect] = useState(null); // For catch effect animation
  
  const gameAreaRef = useRef(null);
  const gameLoopRef = useRef(null);
  const lastSpawnTimeRef = useRef(0);

  const emotionWords = {
    positive: ['😊 Happy', '🎉 Excited', '💖 Love', '✨ Amazing', '🌟 Wonderful', '🌈 Joy', '🦋 Delighted', '💫 Fantastic'],
    negative: ['😢 Sad', '😠 Angry', '😰 Worried', '😞 Disappointed', '😤 Frustrated', '😨 Scared', '😭 Crying', '😡 Mad'],
    neutral: ['🤔 Curious', '😐 Neutral', '🤷 Confused', '😶 Unsure', '🤨 Thinking', '😐 Calm', '🤔 Wondering', '😶 Balanced']
  };

  const gameSettings = {
    easy: { speed: 0.8, spawnRate: 1500, wordCount: 3 },
    medium: { speed: 1.0, spawnRate: 1200, wordCount: 4 },
    hard: { speed: 1.3, spawnRate: 800, wordCount: 5 }
  };

  const currentSettings = gameSettings[difficulty];

  useEffect(() => {
    if (gameState === 'playing') {
      startGameLoop();
    }
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState]);

  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  useEffect(() => {
    if (timeLeft <= 0 && gameState === 'playing') {
      endGame();
    }
  }, [timeLeft, gameState]);

  const startGameLoop = () => {
    lastSpawnTimeRef.current = Date.now();
    
    const gameLoop = () => {
      if (gameState !== 'playing') return;
      
      const currentTime = Date.now();
      
      // Spawn new words
      if (currentTime - lastSpawnTimeRef.current > currentSettings.spawnRate) {
        spawnNewWord();
        lastSpawnTimeRef.current = currentTime;
      }
      
      // Check collisions FIRST (before updating positions)
      checkCollisions();
      
      // Then update falling words
      updateFallingWords();
      
      // Continue the game loop
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };
    
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  };

  const spawnNewWord = () => {
    const categories = Object.keys(emotionWords);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomWord = emotionWords[randomCategory][Math.floor(Math.random() * emotionWords[randomCategory].length)];
    
    const newWord = {
      id: Date.now() + Math.random(),
      text: randomWord,
      category: randomCategory,
      x: Math.random() * 80 + 10, // 10% to 90% of screen width
      y: -3, // Start above screen
      speed: currentSettings.speed + Math.random() * 0.2, // Reduced speed variation for smoother movement
      rotation: Math.random() * 360
    };
    
    setFallingWords(prev => [...prev, newWord]);
  };

  const updateFallingWords = () => {
    setFallingWords(prev => 
      prev.map(word => ({
        ...word,
        y: word.y + word.speed,
        rotation: word.rotation + 2
      })).filter(word => word.y < 110) // Allow words to fall further before removal
    );
  };

  const checkCollisions = () => {
    setFallingWords(prev => {
      const updatedWords = [];
      
      for (const word of prev) {
        // Check if word is in basket area (near the bottom)
        // Make collision detection more generous - check if ANY part of the word touches the basket area
        if (word.y >= 70 && word.y <= 98) { // Extended height range for better collision
          const basketLeft = basketPosition - 20; // Much wider basket area for easier catching
          const basketRight = basketPosition + 20;
          
          // Check if word's center OR any part of the word is in the basket area
          // Also add some tolerance for easier catching
          const tolerance = 5; // 5% tolerance for easier collision detection
          if (word.x >= (basketLeft - tolerance) && word.x <= (basketRight + tolerance)) {
            // Word caught! Don't add to updatedWords array
            console.log(`🎯 COLLISION DETECTED: "${word.text}" at (${word.x.toFixed(1)}, ${word.y.toFixed(1)}) in basket area (${basketLeft.toFixed(1)}-${basketRight.toFixed(1)}) with tolerance ${tolerance}%`);
            handleWordCaught(word);
            continue; // Skip to next word
          }
        }
        
        // Only remove words that have completely fallen off screen
        if (word.y > 105) {
          // Word missed - fell to the ground
          console.log(`💥 WORD MISSED: "${word.text}" at (${word.x.toFixed(1)}, ${word.y.toFixed(1)}) - below ground level`);
          handleWordMissed(word);
          continue; // Skip to next word
        }
        
        // Word continues falling
        updatedWords.push(word);
      }
      
      return updatedWords;
    });
  };

  const handleWordCaught = (word) => {
    const points = word.category === 'positive' ? 10 : word.category === 'negative' ? 8 : 6;
    setScore(prev => prev + points);
    setCombo(prev => prev + 1);
    
    // Bonus points for combo
    if (combo >= 5) {
      setScore(prev => prev + 5);
    }
    
    // Level up every 50 points
    if (score + points >= level * 50) {
      setLevel(prev => prev + 1);
    }
    
    // Show catch effect at the word's position
    setCatchEffect({
      x: word.x,
      y: word.y,
      text: word.text,
      timestamp: Date.now()
    });
    
    // Remove catch effect after 500ms
    setTimeout(() => setCatchEffect(null), 500);
    
    // Show score popup
    setScorePopup({
      text: `+${points}`,
      x: basketPosition,
      y: 85,
      timestamp: Date.now()
    });
    
    // Remove popup after 1 second
    setTimeout(() => setScorePopup(null), 1000);
    
    // Visual feedback - flash the basket
    const basketElement = document.querySelector('.basket');
    if (basketElement) {
      basketElement.style.transform = 'translateX(-50%) scale(1.3)';
      setTimeout(() => {
        basketElement.style.transform = 'translateX(-50%) scale(1)';
      }, 200);
    }
    
    // Debug log
    console.log(`🎯 CAUGHT: "${word.text}" at position (${word.x}, ${word.y}) - Score: +${points}`);
  };

  const handleWordMissed = (word) => {
    setLives(prev => {
      const newLives = prev - 1;
      if (newLives <= 0) {
        endGame();
        return 0;
      }
      return newLives;
    });
    setCombo(0);
    
    // Debug log
    console.log(`💥 MISSED: "${word.text}" at position (${word.x}, ${word.y}) - Lives: ${lives - 1}`);
  };

  const handleMouseMove = (e) => {
    if (gameState !== 'playing') return;
    
    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    // More responsive basket movement with better boundaries
    setBasketPosition(Math.max(5, Math.min(95, x)));
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setLives(3);
    setTimeLeft(60);
    setLevel(1);
    setCombo(0);
    setFallingWords([]);
    setBasketPosition(50);
    lastSpawnTimeRef.current = Date.now();
  };

  const pauseGame = () => {
    setGameState('paused');
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
  };

  const resumeGame = () => {
    setGameState('playing');
    startGameLoop();
  };

  const endGame = () => {
    setGameState('gameOver');
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
    
    // Calculate final score with time bonus
    const timeBonus = Math.floor(timeLeft / 10) * 5;
    const finalScore = score + timeBonus;
    
    if (finalScore >= 100) {
      setGameState('won');
    }
  };

  const renderGameArea = () => {
    if (gameState === 'ready') {
      return (
        <div className="game-intro">
          <h2>🎯 Emotion Catch Challenge! 🎯</h2>
          <p>Catch the falling emotion words with your basket!</p>
          <div className="game-instructions">
            <div className="instruction">
              <span className="emoji">😊</span>
              <span>Positive words = 10 points</span>
            </div>
            <div className="instruction">
              <span className="emoji">😢</span>
              <span>Negative words = 8 points</span>
            </div>
            <div className="instruction">
              <span className="emoji">🤔</span>
              <span>Neutral words = 6 points</span>
            </div>
          </div>
          <button className="btn btn-primary" onClick={startGame}>
            🚀 Start Game!
          </button>
        </div>
      );
    }

    if (gameState === 'playing' || gameState === 'paused') {
      return (
        <div className="game-area" ref={gameAreaRef} onMouseMove={handleMouseMove}>
          {/* Game stats */}
          <div className="game-stats">
            <div className="stat">
              <span className="stat-label">Score:</span>
              <span className="stat-value">{score}</span>
            </div>
                         <div className="stat">
               <span className="stat-label">Lives:</span>
               <span className="stat-value">❤️ {'❤️'.repeat(Math.max(0, Math.min(lives - 1, 2)))}</span>
             </div>
            <div className="stat">
              <span className="stat-label">Time:</span>
              <span className="stat-value">{timeLeft}s</span>
            </div>
            <div className="stat">
              <span className="stat-label">Level:</span>
              <span className="stat-value">{level}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Combo:</span>
              <span className="stat-value">🔥 {combo}</span>
            </div>
          </div>

          {/* Falling words */}
          {fallingWords.map(word => (
            <div
              key={word.id}
              className={`falling-word ${word.category}`}
              style={{
                left: `${word.x}%`,
                top: `${word.y}%`,
                transform: `rotate(${word.rotation}deg)`
              }}
            >
              {word.text}
            </div>
          ))}
          
          {/* Word position debug info */}
          {fallingWords.length > 0 && (
            <div
              style={{
                position: 'absolute',
                top: '80px',
                right: '20px',
                background: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                padding: '10px',
                borderRadius: '10px',
                fontSize: '0.8rem',
                zIndex: 25
              }}
            >
              <div>Words: {fallingWords.length}</div>
              {fallingWords.slice(0, 3).map(word => (
                <div key={word.id}>
                  {word.text}: ({word.x.toFixed(1)}, {word.y.toFixed(1)})
                </div>
              ))}
            </div>
          )}

          {/* Ground line for reference */}
          <div
            className="ground-line"
            style={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              right: '0',
              height: '2px',
              background: 'rgba(0, 0, 0, 0.3)',
              zIndex: 1
            }}
          />
          
          {/* Collision area indicator (for debugging) */}
          <div
            className="collision-indicator"
            style={{
              position: 'absolute',
              bottom: '20px',
              left: `${basketPosition - 20}%`,
              width: '40%',
              height: '28%',
              border: '3px solid rgba(255, 255, 0, 0.8)',
              background: 'rgba(255, 255, 0, 0.1)',
              pointerEvents: 'none',
              zIndex: 1
            }}
          />
          
          {/* Collision area text label */}
          <div
            style={{
              position: 'absolute',
              bottom: '53px',
              left: `${basketPosition}%`,
              transform: 'translateX(-50%)',
              color: 'rgba(255, 255, 0, 0.8)',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              pointerEvents: 'none',
              zIndex: 1,
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
            }}
          >
            CATCH ZONE
          </div>
          
          {/* Catch Effect */}
          {catchEffect && (
            <div
              style={{
                position: 'absolute',
                left: `${catchEffect.x}%`,
                top: `${catchEffect.y}%`,
                transform: 'translateX(-50%)',
                color: '#00FF00',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
                zIndex: 30,
                animation: 'catchEffect 0.5s ease-out forwards'
              }}
            >
              ✨ CAUGHT! ✨
            </div>
          )}
          
          {/* Score Popup */}
          {scorePopup && (
            <div
              className="score-popup"
              style={{
                position: 'absolute',
                left: `${scorePopup.x}%`,
                top: `${scorePopup.y}%`,
                transform: 'translateX(-50%)',
                color: '#FFD700',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
                zIndex: 20,
                animation: 'scorePopup 1s ease-out forwards'
              }}
            >
              {scorePopup.text}
            </div>
          )}
          
          {/* Basket */}
          <div
            className="basket"
            style={{ left: `${basketPosition}%` }}
          >
            🧺
          </div>

          {/* Pause overlay */}
          {gameState === 'paused' && (
            <div className="pause-overlay">
              <h3>Game Paused</h3>
              <button className="btn btn-primary" onClick={resumeGame}>
                Resume
              </button>
            </div>
          )}
        </div>
      );
    }

    if (gameState === 'won') {
      return (
        <div className="game-result won">
          <h2>🎉 Congratulations! 🎉</h2>
          <p>You've mastered the Emotion Catch Challenge!</p>
          <div className="final-score">
            <span className="score-label">Final Score:</span>
            <span className="score-value">{score}</span>
          </div>
          <div className="achievements">
            <div className="achievement">🏆 Level {level} Master</div>
            <div className="achievement">🔥 {combo} Combo Champion</div>
            <div className="achievement">⏱️ Time Bonus: +{Math.floor(timeLeft / 10) * 5}</div>
          </div>
          <button className="btn btn-primary" onClick={onComplete}>
            Continue Adventure! 🚀
          </button>
        </div>
      );
    }

    if (gameState === 'gameOver') {
      return (
        <div className="game-result game-over">
          <h2>😔 Game Over</h2>
          <p>Don't worry, practice makes perfect!</p>
          <div className="final-score">
            <span className="score-label">Final Score:</span>
            <span className="score-value">{score}</span>
          </div>
          <button className="btn btn-primary" onClick={startGame}>
            Try Again! 🔄
          </button>
        </div>
      );
    }
  };

  return (
    <div className="emotion-catch-game">
      <div className="game-container">
        {renderGameArea()}
        
        {gameState === 'playing' && (
          <div className="game-controls">
            <button className="btn btn-secondary" onClick={pauseGame}>
              ⏸️ Pause
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmotionCatchGame;

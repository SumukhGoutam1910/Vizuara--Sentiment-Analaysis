import React, { useEffect, useRef, useState } from 'react';
import './FloatingCharacter.css';

const FloatingCharacter = ({ 
  character, 
  position = 'random', 
  behavior = 'float',
  onClick,
  isInteractive = true 
}) => {
  const characterRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState(character.defaultEmotion || '😊');

  const characters = {
    happyHelper: {
      emojis: ['😊', '🤗', '🎉', '💖', '✨'],
      defaultEmotion: '😊',
      colors: ['#FFD700', '#FFA500', '#FF69B4'],
      messages: ['Hello there!', 'Great job!', 'Keep going!', 'You\'re amazing!']
    },
    curiousCat: {
      emojis: ['😺', '🤔', '🔍', '💭', '🎯'],
      defaultEmotion: '😺',
      colors: ['#87CEEB', '#98FB98', '#DDA0DD'],
      messages: ['Meow!', 'Interesting!', 'Tell me more!', 'What\'s next?']
    },
    wiseOwl: {
      emojis: ['🦉', '🧠', '💡', '📚', '🎓'],
      defaultEmotion: '🦉',
      colors: ['#8B4513', '#CD853F', '#DEB887'],
      messages: ['Hoot hoot!', 'Very wise!', 'Excellent!', 'You\'ve got it!']
    },
    magicWizard: {
      emojis: ['🧙‍♂️', '🔮', '✨', '🌟', '💫'],
      defaultEmotion: '🧙‍♂️',
      colors: ['#9932CC', '#8A2BE2', '#9370DB'],
      messages: ['Abracadabra!', 'Magic!', 'Wonderful!', 'You\'re enchanting!']
    }
  };

  const charData = characters[character] || characters.happyHelper;

  useEffect(() => {
    if (!characterRef.current) return;

    const element = characterRef.current;
    let animationId;
    let startTime = Date.now();
    let lastFrameTime = 0;
    
    // Function to get current mobile state
    const getMobileState = () => {
      return window.innerWidth <= 768;
    };
    
    // Function to check if device is very small mobile
    const isVerySmallMobile = () => {
      return window.innerWidth <= 480;
    };
    
    // Initial mobile detection
    let isMobile = getMobileState();
    let isVerySmall = isVerySmallMobile();
    
    // Adjust animation speeds for mobile devices - much slower and gentler
    let speedMultiplier = isMobile ? 0.1 : 1; // 90% slower on mobile
    let movementMultiplier = isMobile ? 0.3 : 1; // 70% less movement on mobile
    let rotationMultiplier = isMobile ? 0.05 : 1; // 95% slower rotation on mobile
    
    // Completely disable animations on very small devices
    if (isVerySmall) {
      speedMultiplier = 0;
      movementMultiplier = 0;
      rotationMultiplier = 0;
    }

    const animate = (currentTime) => {
      // Frame rate limiting for mobile
      if (isMobile && currentTime - lastFrameTime < 100) { // 10 FPS on mobile
        animationId = requestAnimationFrame(animate);
        return;
      }
      lastFrameTime = currentTime;
      
      const elapsed = Date.now() - startTime;
      
      if (behavior === 'float') {
        const y = Math.sin(elapsed * 0.001 * speedMultiplier) * 20 * movementMultiplier;
        const x = Math.sin(elapsed * 0.0007 * speedMultiplier) * 15 * movementMultiplier;
        element.style.transform = `translate(${x}px, ${y}px)`;
      } else if (behavior === 'bounce') {
        const y = Math.abs(Math.sin(elapsed * 0.002 * speedMultiplier)) * 30 * movementMultiplier;
        element.style.transform = `translateY(${-y}px)`;
      } else if (behavior === 'rotate') {
        const rotation = (elapsed * 0.05 * rotationMultiplier) % 360;
        element.style.transform = `rotate(${rotation}deg)`;
      }

      animationId = requestAnimationFrame(animate);
    };

    // Handle window resize and orientation change
    const handleResize = () => {
      const newMobileState = getMobileState();
      const newVerySmallState = isVerySmallMobile();
      
      if (newMobileState !== isMobile || newVerySmallState !== isVerySmall) {
        isMobile = newMobileState;
        isVerySmall = newVerySmallState;
        
        if (isVerySmall) {
          // Completely disable animations on very small devices
          speedMultiplier = 0;
          movementMultiplier = 0;
          rotationMultiplier = 0;
        } else if (isMobile) {
          // Mobile optimizations
          speedMultiplier = 0.1;
          movementMultiplier = 0.3;
          rotationMultiplier = 0.05;
        } else {
          // Desktop full speed
          speedMultiplier = 1;
          movementMultiplier = 1;
          rotationMultiplier = 1;
        }
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [behavior]);

  const handleClick = () => {
    if (!isInteractive) return;
    
    setIsClicked(true);
    
    // Change emotion temporarily
    const randomEmotion = charData.emojis[Math.floor(Math.random() * charData.emojis.length)];
    setCurrentEmotion(randomEmotion);
    
    // Show random message
    const randomMessage = charData.messages[Math.floor(Math.random() * charData.messages.length)];
    
    // Create floating message
    const message = document.createElement('div');
    message.className = 'floating-message';
    message.textContent = randomMessage;
    message.style.position = 'absolute';
    message.style.left = `${Math.random() * 200 - 100}px`;
    message.style.top = '-50px';
    message.style.color = charData.colors[Math.floor(Math.random() * charData.colors.length)];
    message.style.fontWeight = 'bold';
    message.style.fontSize = '16px';
    message.style.pointerEvents = 'none';
    message.style.zIndex = '1000';
    message.style.transition = 'all 2s ease-out';
    
    characterRef.current.appendChild(message);
    
    setTimeout(() => {
      message.style.transform = 'translateY(-100px)';
      message.style.opacity = '0';
    }, 100);
    
    setTimeout(() => {
      if (message.parentNode) {
        message.parentNode.removeChild(message);
      }
    }, 2000);
    
    // Reset emotion after a delay
    setTimeout(() => {
      setCurrentEmotion(charData.defaultEmotion);
      setIsClicked(false);
    }, 1500);
    
    if (onClick) onClick();
  };

  const handleMouseEnter = () => {
    if (isInteractive && characterRef.current) {
      setIsHovered(true);
      characterRef.current.style.transform = 'scale(1.2)';
    }
  };

  const handleMouseLeave = () => {
    if (isInteractive && characterRef.current) {
      setIsHovered(false);
      characterRef.current.style.transform = 'scale(1)';
    }
  };

  return (
    <div
      ref={characterRef}
      className={`floating-character ${behavior} ${isHovered ? 'hovered' : ''} ${isClicked ? 'clicked' : ''}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'fixed',
        left: position === 'random' ? `${Math.random() * 80 + 10}%` : position.x || '50%',
        top: position === 'random' ? `${Math.random() * 80 + 10}%` : position.y || '50%',
        cursor: isInteractive ? 'pointer' : 'default',
        zIndex: 10
      }}
    >
      <div className="character-emoji">
        {currentEmotion}
      </div>
      {isHovered && isInteractive && (
        <div className="character-tooltip">
          Click me!
        </div>
      )}
    </div>
  );
};

export default FloatingCharacter;

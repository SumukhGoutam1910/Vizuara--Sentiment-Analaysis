import React, { useState, useRef, useEffect } from 'react';
import './InteractiveCard.css';

const InteractiveCard = ({ 
  children, 
  className = '', 
  depth = 20, 
  interactive = true,
  glow = false,
  floating = false,
  onClick,
  onHover,
  onLeave
}) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [floatingOffset, setFloatingOffset] = useState(0);

  useEffect(() => {
    if (floating) {
      const animate = () => {
        setFloatingOffset(prev => prev + 0.02);
      };
      const interval = setInterval(animate, 16);
      return () => clearInterval(interval);
    }
  }, [floating]);

  const handleMouseMove = (e) => {
    if (!interactive || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const rotateX = (mouseY / (rect.height / 2)) * -depth;
    const rotateY = (mouseX / (rect.width / 2)) * depth;
    
    setRotation({ x: rotateX, y: rotateY });
    
    // Parallax effect
    const moveX = (mouseX / (rect.width / 2)) * 10;
    const moveY = (mouseY / (rect.height / 2)) * 10;
    
    setPosition({ x: moveX, y: moveY });
  };

  const handleMouseEnter = () => {
    if (!interactive) return;
    setIsHovered(true);
    if (onHover) onHover();
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
    setPosition({ x: 0, y: 0 });
    if (onLeave) onLeave();
  };

  const handleMouseDown = () => {
    if (!interactive) return;
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    if (!interactive) return;
    setIsPressed(false);
  };

  const handleClick = () => {
    if (!interactive) return;
    if (onClick) onClick();
  };

  const floatingY = floating ? Math.sin(floatingOffset) * 10 : 0;

  return (
    <div
      ref={cardRef}
      className={`interactive-card ${className} ${isHovered ? 'hovered' : ''} ${isPressed ? 'pressed' : ''} ${glow ? 'glow' : ''} ${floating ? 'floating' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      style={{
        transform: `
          perspective(1000px) 
          rotateX(${rotation.x}deg) 
          rotateY(${rotation.y}deg)
          translateX(${position.x}px) 
          translateY(${position.y + floatingY}px)
          scale(${isPressed ? 0.95 : isHovered ? 1.05 : 1})
        `,
        cursor: interactive ? 'pointer' : 'default'
      }}
    >
      <div className="card-content">
        {children}
      </div>
      
      {/* Glow effect */}
      {glow && (
        <div className="card-glow" />
      )}
      
      {/* Reflection effect */}
      <div className="card-reflection" />
    </div>
  );
};

// Specialized card variants
export const StoryCard = ({ children, chapter, ...props }) => (
  <InteractiveCard 
    className="story-card" 
    depth={15} 
    glow={true} 
    floating={true}
    {...props}
  >
    <div className="story-card-header">
      <span className="chapter-badge">Chapter {chapter}</span>
    </div>
    <div className="story-card-body">
      {children}
    </div>
  </InteractiveCard>
);

export const ExerciseCard = ({ children, type, difficulty, ...props }) => (
  <InteractiveCard 
    className="exercise-card" 
    depth={25} 
    glow={true}
    {...props}
  >
    <div className="exercise-card-header">
      <span className={`difficulty-badge ${difficulty}`}>
        {difficulty}
      </span>
      <span className="exercise-type">{type}</span>
    </div>
    <div className="exercise-card-body">
      {children}
    </div>
  </InteractiveCard>
);

export const AchievementCard = ({ children, title, icon, ...props }) => (
  <InteractiveCard 
    className="achievement-card" 
    depth={30} 
    glow={true} 
    floating={true}
    {...props}
  >
    <div className="achievement-card-header">
      <span className="achievement-icon">{icon}</span>
      <span className="achievement-title">{title}</span>
    </div>
    <div className="achievement-card-body">
      {children}
    </div>
  </InteractiveCard>
);

export const CharacterCard = ({ character, emotion, message, ...props }) => (
  <InteractiveCard 
    className="character-card" 
    depth={20} 
    glow={true}
    {...props}
  >
    <div className="character-card-content">
      <div className="character-avatar">
        {emotion}
      </div>
      <div className="character-message">
        {message}
      </div>
    </div>
  </InteractiveCard>
);

export default InteractiveCard;

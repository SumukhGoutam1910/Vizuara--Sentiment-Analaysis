import React from 'react';
import { useButtonSound } from '../hooks/useButtonSound';
import soundManager from '../utils/soundUtils';

/**
 * Example component showing how to use button sounds
 * You can use this pattern in your other components
 */
const ButtonWithSound = ({ children, onClick, className = '', ...props }) => {
  const withSound = useButtonSound(soundManager.isSoundOn());

  const handleClick = withSound(onClick);

  return (
    <button 
      className={className} 
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default ButtonWithSound;

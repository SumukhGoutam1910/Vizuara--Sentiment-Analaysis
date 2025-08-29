import { useCallback } from 'react';
import { playButtonClick } from '../utils/soundUtils';

/**
 * Custom hook for adding button click sounds to components
 * @param {boolean} enabled - Whether sound is enabled (optional, defaults to true)
 * @returns {Function} - Function to wrap button click handlers
 */
export const useButtonSound = (enabled = true) => {
  const withSound = useCallback((handler) => {
    return (...args) => {
      if (enabled) {
        playButtonClick();
      }
      if (handler) {
        handler(...args);
      }
    };
  }, [enabled]);

  return withSound;
};

/**
 * Higher-order function to wrap button click handlers with sound
 * @param {Function} handler - The original click handler
 * @param {boolean} enabled - Whether sound is enabled (optional, defaults to true)
 * @returns {Function} - Wrapped handler with sound
 */
export const withButtonSound = (handler, enabled = true) => {
  return (...args) => {
    if (enabled) {
      playButtonClick();
    }
    if (handler) {
      handler(...args);
    }
  };
};

export default useButtonSound;

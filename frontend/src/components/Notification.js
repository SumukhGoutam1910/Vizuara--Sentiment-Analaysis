import React, { useState, useEffect } from 'react';
import './Notification.css';

const Notification = ({ message, isVisible, onClose }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Small delay to trigger the slide-in animation
      const timer = setTimeout(() => {
        setIsAnimating(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const handleClose = () => {
    setIsAnimating(false);
    // Wait for animation to complete before calling onClose
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div className={`notification ${isAnimating ? 'slide-in' : ''}`}>
      <div className="notification-content">
        <span className="notification-message">{message}</span>
        <button className="notification-close" onClick={handleClose}>
          ✕
        </button>
      </div>
    </div>
  );
};

export default Notification;

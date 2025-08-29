import React, { useState, useEffect } from 'react';
import './Notification.css';

const Notification = ({ notifications, onClose }) => {
  const [animatingNotifications, setAnimatingNotifications] = useState(new Set());

  useEffect(() => {
    if (notifications && notifications.length > 0) {
      // Trigger animation for each visible notification
      const timer = setTimeout(() => {
        const newAnimating = new Set();
        notifications.forEach((_, index) => {
          newAnimating.add(index);
        });
        setAnimatingNotifications(newAnimating);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  const handleClose = (index) => {
    setAnimatingNotifications(prev => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
    
    // Wait for animation to complete before calling onClose
    setTimeout(() => {
      onClose(index);
    }, 300);
  };

  if (!notifications || notifications.length === 0) return null;

  return (
    <div className="notifications-container">
      {notifications.map((notification, index) => (
        <div 
          key={index}
          className={`notification ${notification.type || 'red'} ${animatingNotifications.has(index) ? 'slide-in' : ''}`}
          style={{ top: `${20 + (index * 80)}px` }}
        >
          <div className="notification-content">
            <span className="notification-message">{notification.message}</span>
            <button className="notification-close" onClick={() => handleClose(index)}>
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notification;

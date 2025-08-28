import React, { useState } from 'react';
import './Conclusion.css';

const Conclusion = ({ userProgress }) => {
  const [showCertificate, setShowCertificate] = useState(false);

  const getPerformanceMessage = (score) => {
    if (score >= 90) return "Outstanding! You're a Master Emotion Detective! 🏆";
    if (score >= 80) return "Excellent! You're a Skilled Emotion Detective! 🌟";
    if (score >= 70) return "Great job! You're a Competent Emotion Detective! ✨";
    if (score >= 60) return "Good work! You're a Promising Emotion Detective! 👍";
    return "Well done! You're on your way to becoming an Emotion Detective! 🎯";
  };

  const getPerformanceColor = (score) => {
    if (score >= 90) return "#FFD700"; // Gold
    if (score >= 80) return "#C0C0C0"; // Silver
    if (score >= 70) return "#CD7F32"; // Bronze
    return "#4CAF50"; // Green
  };

  const handleDownloadCertificate = () => {
    // Create a simple certificate download
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;
    
    // Draw certificate background
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, 800, 600);
    
    // Draw border
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 10;
    ctx.strokeRect(20, 20, 760, 560);
    
    // Draw title
    ctx.fillStyle = '#333';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Certificate of Achievement', 400, 120);
    
    // Draw subtitle
    ctx.font = '24px Arial';
    ctx.fillText('Emotion Detective Training', 400, 160);
    
    // Draw student name
    ctx.font = 'bold 36px Arial';
    ctx.fillText(`This is to certify that`, 400, 240);
    ctx.fillText(`${userProgress.name}`, 400, 290);
    ctx.fillText(`has successfully completed`, 400, 340);
    ctx.fillText(`Sentiment Analysis Training`, 400, 390);
    
    // Draw score
    ctx.font = '28px Arial';
    ctx.fillText(`Final Score: ${userProgress.finalScore}%`, 400, 450);
    
    // Draw date
    ctx.font = '20px Arial';
    ctx.fillText(`Date: ${new Date().toLocaleDateString()}`, 400, 500);
    
    // Draw signature line
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(300, 540);
    ctx.lineTo(500, 540);
    ctx.stroke();
    ctx.font = '18px Arial';
    ctx.fillText('Emotion Detective Academy', 400, 570);
    
    // Convert to blob and download
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `emotion-detective-certificate-${userProgress.name}.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="conclusion-container">
      <div className="conclusion-card card fade-in">
        <div className="conclusion-header">
          <h2 className="conclusion-title">
            🎉 Congratulations, Detective {userProgress.name}!
          </h2>
          <p className="conclusion-subtitle">
            You've successfully completed your training in Sentiment Analysis!
          </p>
        </div>

        <div className="achievement-celebration">
          <div className="celebration-icon">
            <span className="trophy">🏆</span>
          </div>
          <div className="celebration-text">
            <h3>{getPerformanceMessage(userProgress.finalScore)}</h3>
            <p>You've learned how computers can understand emotions in text, just like a real detective!</p>
          </div>
        </div>

        <div className="final-stats">
          <h4>📊 Your Final Statistics:</h4>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-icon">🎯</span>
              <span className="stat-label">Final Challenge Score</span>
              <span className="stat-value" style={{ color: getPerformanceColor(userProgress.finalScore) }}>
                {userProgress.finalScore}%
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">📝</span>
              <span className="stat-label">Practice Exercises</span>
              <span className="stat-value">
                {userProgress.exerciseScores ? userProgress.exerciseScores.length : 0} completed
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">⭐</span>
              <span className="stat-label">Average Practice Score</span>
              <span className="stat-value">
                {userProgress.exerciseScores && userProgress.exerciseScores.length > 0 
                  ? Math.round(userProgress.exerciseScores.reduce((a, b) => a + b, 0) / userProgress.exerciseScores.length)
                  : 0}%
              </span>
            </div>
          </div>
        </div>

        <div className="what-you-learned">
          <h4>🎓 What You've Learned:</h4>
          <div className="learning-points">
            <div className="learning-point">
              <span className="point-icon">🔍</span>
              <span>How to identify emotions in text messages</span>
            </div>
            <div className="learning-point">
              <span className="point-icon">🧠</span>
              <span>How computers analyze sentiment using word scoring</span>
            </div>
            <div className="learning-point">
              <span className="point-icon">📊</span>
              <span>How to classify text as positive, negative, or neutral</span>
            </div>
            <div className="learning-point">
              <span className="point-icon">🌍</span>
              <span>Real-world applications of sentiment analysis</span>
            </div>
          </div>
        </div>

        <div className="real-world-applications">
          <h4>🚀 How This Helps in the Real World:</h4>
          <div className="applications-grid">
            <div className="application-item">
              <span className="app-icon">💬</span>
              <h5>Social Media</h5>
              <p>Companies use sentiment analysis to understand how people feel about their products</p>
            </div>
            <div className="application-item">
              <span className="app-icon">📱</span>
              <h5>Customer Service</h5>
              <p>Businesses can quickly identify unhappy customers and help them faster</p>
            </div>
            <div className="application-item">
              <span className="app-icon">📰</span>
              <h5>News Analysis</h5>
              <p>Journalists can understand public reaction to different stories</p>
            </div>
            <div className="application-item">
              <span className="app-icon">🎮</span>
              <h5>Gaming</h5>
              <p>Game developers can create characters that respond to player emotions</p>
            </div>
          </div>
        </div>

        <div className="next-steps">
          <h4>🔄 What's Next?</h4>
          <div className="steps-list">
            <div className="step-item">
              <span className="step-number">1</span>
              <span className="step-text">Practice analyzing real social media posts and reviews</span>
            </div>
            <div className="step-item">
              <span className="step-number">2</span>
              <span className="step-text">Learn about more advanced AI techniques like machine learning</span>
            </div>
            <div className="step-item">
              <span className="step-number">3</span>
              <span className="step-text">Explore how sentiment analysis is used in your favorite apps</span>
            </div>
            <div className="step-item">
              <span className="step-number">4</span>
              <span className="step-text">Share your knowledge with friends and family!</span>
            </div>
          </div>
        </div>

        <div className="certificate-section">
          <h4>📜 Your Achievement Certificate:</h4>
          <p>Download your official Emotion Detective certificate to show off your new skills!</p>
          
          <button 
            className="btn btn-success"
            onClick={handleDownloadCertificate}
          >
            🎓 Download Certificate
          </button>
        </div>

        <div className="farewell">
          <h4>👋 Thank You for Learning with Us!</h4>
          <p>
            You've taken your first step into the exciting world of Artificial Intelligence and Natural Language Processing. 
            Remember, every expert was once a beginner. Keep exploring, keep learning, and keep being curious!
          </p>
          
          <div className="farewell-quote">
            <blockquote>
              "The best way to predict the future is to invent it." - Alan Kay
            </blockquote>
          </div>
        </div>

        <div className="restart-section">
          <p>Want to practice again or show someone else how it works?</p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            🔄 Start Over
          </button>
        </div>
      </div>
    </div>
  );
};

export default Conclusion;

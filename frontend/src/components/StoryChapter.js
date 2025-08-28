import React, { useState, useEffect, useRef } from 'react';
import './StoryChapter.css';
import HumanCharacter from './HumanCharacter';

const StoryChapter = ({ onNext, userProgress }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const storyHeaderRef = useRef(null);

  const storyPages = [
    {
      title: "Chapter 1: The Mystery of Textville",
      content: `Welcome to Textville, ${userProgress.name}! This is a special town where all the messages people send to each other live. But lately, something strange has been happening...`,
      characterType: "professor",
      characterName: "Professor Sarah",
      dialogue: "Oh no! The messages are getting all mixed up! People are sending happy messages that sound sad, and sad messages that sound happy!",
      scene: "textville"
    },
    {
      title: "The Problem: Context Confusion",
      content: "Yesterday, Sarah sent a message saying 'I'm so excited about my birthday party tomorrow!' But when her friend read it, it sounded sad. This happened because the AI system only looked at individual words without understanding the context. It's like trying to solve a puzzle with only half the pieces!",
      characterType: "techexpert",
      characterName: "Tech Expert Mike",
      dialogue: "The problem is that simple word-counting algorithms can't understand sarcasm, context, or cultural nuances. We need something smarter!",
      scene: "problem"
    },
    {
      title: "The Solution: Advanced Sentiment Analysis",
      content: "That's where YOU come in, Detective! We need to teach computers to use advanced AI algorithms like Neural Networks, Support Vector Machines, and Natural Language Processing. These algorithms can understand context, detect sarcasm, and even learn from examples - just like how you learn!",
      characterType: "professor",
      characterName: "Professor Sarah",
      dialogue: "Exactly! Modern AI doesn't just count words - it understands relationships between words, context, and even cultural patterns!",
      scene: "solution"
    },
    {
      title: "How Do AI Algorithms Work?",
      content: "Advanced AI systems use multiple techniques: 1) Word Embeddings (like Word2Vec) to understand word relationships, 2) Neural Networks to process complex patterns, 3) Feature Extraction to identify important emotional indicators, and 4) Confidence Scoring to show how certain the AI is about its prediction. It's like having a super-smart detective that never gets tired!",
      characterType: "techexpert",
      characterName: "Tech Expert Mike",
      dialogue: "So it's not just counting words - it's understanding the deeper meaning and context! That's much more sophisticated!",
      scene: "how-it-works"
    },
    {
      title: "The Technical Challenge",
      content: "The biggest challenge in sentiment analysis is handling mixed emotions, sarcasm, and cultural differences. For example, 'This movie was so bad it was good!' contains both negative and positive sentiment. AI must use advanced algorithms to weigh different factors and calculate a nuanced sentiment score.",
      characterType: "professor",
      characterName: "Professor Sarah",
      dialogue: "This is why we need intelligent algorithms that can think like humans - understanding context, tone, and subtle emotional cues!",
      scene: "technical-challenge"
    },
    {
      title: "Ready to Practice with AI?",
      content: "Now it's time for your first case, Detective! You'll get to see how advanced AI algorithms work with real examples. You'll learn about confidence scores, feature extraction, and how AI handles complex emotional scenarios. Are you ready to dive into the technical world of sentiment analysis?",
      characterType: "professor",
      characterName: "Professor Sarah",
      dialogue: "Let's start with some examples that show the power of modern AI algorithms!",
      scene: "ready"
    }
  ];

  useEffect(() => {
    // Show speech bubble with animation
    setShowSpeechBubble(false);
    setTimeout(() => setShowSpeechBubble(true), 300);
    
    // Auto-scroll to top of story when page changes
    if (storyHeaderRef.current) {
      storyHeaderRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }, [currentPage]);

  const handleNext = () => {
    if (currentPage < storyPages.length - 1) {
      setCurrentPage(currentPage + 1);
      // Auto-scroll to top of story when moving to next page
      if (storyHeaderRef.current) {
        storyHeaderRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    } else {
      setShowQuiz(true);
      // Auto-scroll to top of story when showing quiz
      if (storyHeaderRef.current) {
        storyHeaderRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }
  };

  const handleQuizAnswer = (questionId, answer) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleQuizSubmit = () => {
    // Simple scoring - just check if they understand the concept
    const score = Object.keys(quizAnswers).length;
    if (score >= 2) {
      onNext();
      // Auto-scroll to top when moving to next main section (page-level scroll)
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const currentStory = storyPages[currentPage];



  if (showQuiz) {
    return (
      <div className="story-container">
        <div className="story-card card fade-in">
          <h2 className="quiz-title">🎯 Quick Check: Are You Ready?</h2>
          
          <div className="quiz-questions">
            <div className="quiz-question">
              <h3>Question 1: What is Sentiment Analysis?</h3>
              <div className="quiz-options">
                <label>
                  <input
                    type="radio"
                    name="q1"
                    value="a"
                    onChange={() => handleQuizAnswer('q1', 'a')}
                  />
                  A) A way to count words in text
                </label>
                <label>
                  <input
                    type="radio"
                    name="q1"
                    value="b"
                    onChange={() => handleQuizAnswer('q1', 'b')}
                  />
                  B) A way to understand emotions in text
                </label>
                <label>
                  <input
                    type="radio"
                    name="q1"
                    value="c"
                    onChange={() => handleQuizAnswer('q1', 'c')}
                  />
                  C) A way to fix spelling mistakes
                </label>
              </div>
            </div>

            <div className="quiz-question">
              <h3>Question 2: How do computers understand emotions in text?</h3>
              <div className="quiz-options">
                <label>
                  <input
                    type="radio"
                    name="q2"
                    value="a"
                    onChange={() => handleQuizAnswer('q2', 'a')}
                  />
                  A) By reading the text out loud
                </label>
                <label>
                  <input
                    type="radio"
                    name="q2"
                    value="b"
                    onChange={() => handleQuizAnswer('q2', 'b')}
                  />
                  B) By giving emotion scores to words and adding them up
                </label>
                <label>
                  <input
                    type="radio"
                    name="q2"
                    value="c"
                    onChange={() => handleQuizAnswer('q2', 'c')}
                  />
                  C) By asking the writer how they feel
                </label>
              </div>
            </div>
          </div>

          <button 
            className="btn btn-primary"
            onClick={handleQuizSubmit}
            disabled={Object.keys(quizAnswers).length < 2}
          >
            🚀 I'm Ready for My First Case!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="story-container">
      <div className="story-card card fade-in">
        <div className="story-header" ref={storyHeaderRef}>
          <h2 className="story-title">{currentStory.title}</h2>
          <div className="story-progress">
            Page {currentPage + 1} of {storyPages.length}
          </div>
        </div>

        <div className="story-content">
          <div className="story-text">
            <p>{currentStory.content}</p>
          </div>

          {/* Enhanced Character Dialogue */}
          <div className="character-dialogue">
            <div className="character-avatar">
              <HumanCharacter 
                characterType={currentStory.characterType}
                isSpeaking={showSpeechBubble}
                className="story-character"
              />
              <span className="character-name">{currentStory.characterName}</span>
            </div>
            <div className={`dialogue-bubble ${showSpeechBubble ? 'show' : ''}`}>
              <div className="dialogue-content">
                <p>"{currentStory.dialogue}"</p>
              </div>
              <div className="dialogue-arrow"></div>
            </div>
          </div>
        </div>

        <div className="story-navigation">
          {currentPage > 0 && (
            <button 
              className="btn btn-secondary"
              onClick={() => {
                setCurrentPage(currentPage - 1);
                // Auto-scroll to top of story when going to previous page
                if (storyHeaderRef.current) {
                  storyHeaderRef.current.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                  });
                }
              }}
            >
              ⬅️ Previous Page
            </button>
          )}
          <button 
            className="btn btn-primary"
            onClick={handleNext}
          >
            {currentPage === storyPages.length - 1 ? "Take the Quiz! 🎯" : "Next Page ➡️"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryChapter;

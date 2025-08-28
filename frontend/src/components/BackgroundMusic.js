import React, { useState, useEffect, useRef } from 'react';
import './BackgroundMusic.css';

const BackgroundMusic = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef(null);

  // Detective-themed background music tracks
  // Using the actual audio files you have
  const musicTracks = [
    {
      name: "Hip Hop Detective",
      url: "/audio/hip-hop-detective-174661.mp3",
      fallbackUrl: "/audio/hip-hop-detective-174661.mp3",
      description: "Upbeat hip-hop detective music for learning adventures"
    },
    {
      name: "Comedy Detective",
      url: "/audio/comedy-detective-127185.mp3",
      fallbackUrl: "/audio/comedy-detective-127185.mp3",
      description: "Fun and playful detective music for entertainment"
    },
    {
      name: "The Best Detective",
      url: "/audio/the-best-detective-190125.mp3",
      fallbackUrl: "/audio/the-best-detective-190125.mp3",
      description: "Epic detective music for exciting learning moments"
    }
  ];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set initial volume
    audio.volume = volume;

    // Handle track end - loop to next track
    const handleTrackEnd = () => {
      setCurrentTrack((prev) => (prev + 1) % musicTracks.length);
    };

    // Handle audio load
    const handleCanPlay = () => {
      setAudioError(false);
      if (isPlaying) {
        audio.play().catch(console.error);
      }
    };

    // Handle audio errors
    const handleError = () => {
      console.warn('Audio failed to load, trying fallback...');
      setAudioError(true);
      // Try fallback URL
      const currentTrackData = musicTracks[currentTrack];
      if (currentTrackData.fallbackUrl && audio.src !== currentTrackData.fallbackUrl) {
        audio.src = currentTrackData.fallbackUrl;
        audio.load();
      }
    };

    audio.addEventListener('ended', handleTrackEnd);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('ended', handleTrackEnd);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
    };
  }, [isPlaying, musicTracks.length, currentTrack, musicTracks]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const currentTrackData = musicTracks[currentTrack];
    audio.src = currentTrackData.url;
    audio.load();
    
    if (isPlaying) {
      audio.play().catch(console.error);
    }
  }, [currentTrack]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(false);
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % musicTracks.length);
  };

  const previousTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + musicTracks.length) % musicTracks.length);
  };

  // If audio fails to load, show a message
  if (audioError) {
    return (
      <div className="background-music audio-error">
        <div className="error-message">
          <span className="error-icon">🎵</span>
          <span className="error-text">Music temporarily unavailable</span>
          <button 
            className="retry-btn" 
            onClick={() => window.location.reload()}
            title="Retry loading music"
          >
            🔄
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="background-music">
      <audio ref={audioRef} preload="auto" />
      
      {/* Minimized view - always visible */}
      <div className="music-minimized" onClick={togglePlayPause}>
        <div className="music-symbol">🎵</div>
        <div className={`play-indicator ${isPlaying ? 'playing' : ''}`}>
          {isPlaying ? '⏸️' : '▶️'}
        </div>
      </div>
      
      {/* Full controls - only visible on hover */}
      <div className="music-controls">
        <div className="music-info">
          <span className="music-title">{musicTracks[currentTrack].name}</span>
          <span className="music-description">{musicTracks[currentTrack].description}</span>
        </div>
        
        <div className="music-buttons">
          <button 
            className="music-btn previous-btn" 
            onClick={previousTrack}
            title="Previous Track"
          >
            ⏮️
          </button>
          
          <button 
            className={`music-btn play-btn ${isPlaying ? 'playing' : ''}`} 
            onClick={togglePlayPause}
            title={isPlaying ? 'Pause Music' : 'Play Music'}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          
          <button 
            className="music-btn next-btn" 
            onClick={nextTrack}
            title="Next Track"
          >
            ⏭️
          </button>
        </div>
        
        <div className="volume-controls">
          <button 
            className={`music-btn mute-btn ${isMuted ? 'muted' : ''}`} 
            onClick={toggleMute}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
          
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="volume-slider"
            title="Volume Control"
          />
        </div>
      </div>
      
      <div className="music-indicator">
        <div className={`indicator-dot ${isPlaying ? 'pulsing' : ''}`}></div>
        <span className="indicator-text">
          {isPlaying ? 'Music Playing' : 'Music Paused'}
        </span>
      </div>
    </div>
  );
};

export default BackgroundMusic;

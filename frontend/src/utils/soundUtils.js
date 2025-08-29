// Sound utility for button clicks
class SoundManager {
  constructor() {
    this.buttonClickSound = null;
    this.isSoundEnabled = true;
    this.volume = 0.3; // Default volume (30%)
    this.init();
  }

  init() {
    try {
      // Create audio element for button click sound
      this.buttonClickSound = new Audio('/audio/button_click/computer-mouse-click-02-383961.mp3');
      this.buttonClickSound.volume = this.volume;
      this.buttonClickSound.preload = 'auto';
    } catch (error) {
      console.warn('Sound initialization failed:', error);
      this.isSoundEnabled = false;
    }
  }

  playButtonClick() {
    if (!this.isSoundEnabled || !this.buttonClickSound) return;

    try {
      // Reset the audio to start
      this.buttonClickSound.currentTime = 0;
      // Play the sound
      this.buttonClickSound.play().catch(error => {
        console.warn('Failed to play button click sound:', error);
      });
    } catch (error) {
      console.warn('Error playing button click sound:', error);
    }
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume)); // Clamp between 0 and 1
    if (this.buttonClickSound) {
      this.buttonClickSound.volume = this.volume;
    }
  }

  toggleSound() {
    this.isSoundEnabled = !this.isSoundEnabled;
    return this.isSoundEnabled;
  }

  enableSound() {
    this.isSoundEnabled = true;
  }

  disableSound() {
    this.isSoundEnabled = false;
  }

  isSoundOn() {
    return this.isSoundEnabled;
  }
}

// Create a singleton instance
const soundManager = new SoundManager();

// Export the instance and a helper function
export default soundManager;

// Helper function for easy use
export const playButtonClick = () => soundManager.playButtonClick();

// Export the class for advanced usage
export { SoundManager };

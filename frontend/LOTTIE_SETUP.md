# Lottie Animation Setup for Human Characters

## Overview
The story component now uses Lottie animations instead of emoji characters for a more professional and engaging experience.

## Current Setup
- **Professor Sarah**: Uses `/lottie/professor.json`
- **Tech Expert Mike**: Uses `/lottie/techexpert.json`

## How to Add Your Own Lottie Animations

### 1. Get Lottie Files
You can find free Lottie animations from:
- [LottieFiles](https://lottiefiles.com/) - Free and premium animations
- [IconScout](https://iconscout.com/lotties) - Professional animations
- [Design Lottie](https://designlottie.com/) - Custom animations

### 2. Replace the Sample Files
Replace the current JSON files in `/public/lottie/` with your chosen animations:

- **professor.json** - Should represent a knowledgeable, friendly teacher
- **techexpert.json** - Should represent a tech-savvy, curious expert

### 3. Recommended Animation Types
- **Professor**: Gentle waving, nodding, pointing, or teaching gestures
- **Tech Expert**: Thinking, analyzing, or excited discovery animations
- **Duration**: 2-5 seconds looped
- **Style**: Professional, friendly, and educational

### 4. File Requirements
- Format: JSON (Lottie format)
- Size: Keep under 500KB for performance
- Resolution: 200x200px or similar square aspect ratio
- Loop: Should loop seamlessly

### 5. Customization
You can modify the `HumanCharacter.js` component to:
- Add more character types
- Change animation sizes
- Add interaction effects
- Customize fallback emojis

## Fallback System
If Lottie animations fail to load, the system automatically falls back to emoji characters to ensure the story remains functional.

## Performance Notes
- Lottie animations are lightweight and optimized
- Mobile devices handle them well
- Fallback emojis ensure compatibility across all devices

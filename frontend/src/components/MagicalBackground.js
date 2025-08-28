import React, { useEffect, useRef, useState } from 'react';
import './MagicalBackground.css';

const MagicalBackground = ({ theme = 'default', progress = 0, isActive = true }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [currentTheme, setCurrentTheme] = useState(theme);

  const themes = {
    default: {
      colors: ['#667eea', '#764ba2', '#f093fb', '#f5576c'],
      particles: 50,
      speed: 0.5,
      size: { min: 2, max: 6 },
      opacity: { min: 0.3, max: 0.8 }
    },
    positive: {
      colors: ['#FFD700', '#FFA500', '#FF69B4', '#FF1493'],
      particles: 60,
      speed: 0.6,
      size: { min: 3, max: 8 },
      opacity: { min: 0.4, max: 0.9 }
    },
    negative: {
      colors: ['#FF6B6B', '#FF8E8E', '#FFB6C1', '#FFC0CB'],
      particles: 40,
      speed: 0.4,
      size: { min: 2, max: 5 },
      opacity: { min: 0.2, max: 0.7 }
    },
    neutral: {
      colors: ['#87CEEB', '#98FB98', '#DDA0DD', '#F0E68C'],
      particles: 45,
      speed: 0.5,
      size: { min: 2, max: 6 },
      opacity: { min: 0.3, max: 0.8 }
    },
    story: {
      colors: ['#FFB6C1', '#FFC0CB', '#FFE4E1', '#FFF0F5'],
      particles: 55,
      speed: 0.7,
      size: { min: 3, max: 7 },
      opacity: { min: 0.4, max: 0.9 }
    },
    game: {
      colors: ['#32CD32', '#00CED1', '#FFD700', '#FF6347'],
      particles: 70,
      speed: 0.8,
      size: { min: 4, max: 10 },
      opacity: { min: 0.5, max: 1.0 }
    },
    celebration: {
      colors: ['#FFD700', '#FF69B4', '#00CED1', '#FF6347', '#32CD32'],
      particles: 80,
      speed: 1.0,
      size: { min: 5, max: 12 },
      opacity: { min: 0.6, max: 1.0 }
    }
  };

  useEffect(() => {
    setCurrentTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (!isActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const themeData = themes[currentTheme] || themes.default;
    const particles = [];

    // Initialize particles
    for (let i = 0; i < themeData.particles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * themeData.speed,
        vy: (Math.random() - 0.5) * themeData.speed,
        size: Math.random() * (themeData.size.max - themeData.size.min) + themeData.size.min,
        opacity: Math.random() * (themeData.opacity.max - themeData.opacity.min) + themeData.opacity.min,
        color: themeData.colors[Math.floor(Math.random() * themeData.colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2,
        pulse: Math.random() * Math.PI * 2
      });
    }

    // Add progress-based special effects
    const progressParticles = [];
    if (progress > 0) {
      const progressCount = Math.floor(progress / 20) * 5; // 5 particles per 20% progress
      for (let i = 0; i < progressCount; i++) {
        progressParticles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: Math.random() * 8 + 4,
          opacity: 0.8,
          color: '#FFD700',
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 4,
          pulse: Math.random() * Math.PI * 2,
          isProgress: true
        });
      }
    }

    const allParticles = [...particles, ...progressParticles];

    const animate = () => {
      if (!isActive) return;

      ctx.clearRect(0, 0, width, height);

      // Create gradient background
      const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) / 2);
      gradient.addColorStop(0, `rgba(${hexToRgb(themeData.colors[0])}, 0.1)`);
      gradient.addColorStop(0.5, `rgba(${hexToRgb(themeData.colors[1])}, 0.05)`);
      gradient.addColorStop(1, `rgba(${hexToRgb(themeData.colors[2])}, 0.02)`);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Update and draw particles
      allParticles.forEach(particle => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.rotation += particle.rotationSpeed;
        particle.pulse += 0.05;

        // Bounce off edges
        if (particle.x < 0 || particle.x > width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > height) particle.vy *= -1;

        // Keep particles in bounds
        particle.x = Math.max(0, Math.min(width, particle.x));
        particle.y = Math.max(0, Math.min(height, particle.y));

        // Draw particle
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate((particle.rotation * Math.PI) / 180);
        
        // Pulse effect
        const pulseScale = 1 + Math.sin(particle.pulse) * 0.2;
        const finalSize = particle.size * pulseScale;
        
        // Create particle shape
        if (particle.isProgress) {
          // Star shape for progress particles
          drawStar(ctx, 0, 0, finalSize, finalSize / 2, 5);
        } else {
          // Circle for regular particles
          ctx.beginPath();
          ctx.arc(0, 0, finalSize, 0, Math.PI * 2);
        }
        
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
        
        // Add glow effect for progress particles
        if (particle.isProgress) {
          ctx.shadowColor = particle.color;
          ctx.shadowBlur = 20;
          ctx.fill();
        }
        
        ctx.restore();
      });

      // Add floating orbs based on theme
      if (currentTheme === 'story' || currentTheme === 'celebration') {
        drawFloatingOrbs(ctx, width, height, progress);
      }

      // Add progress bar effect
      if (progress > 0) {
        drawProgressEffect(ctx, width, height, progress);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentTheme, progress, isActive]);

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 0, 0';
  };

  const drawStar = (ctx, cx, cy, outerRadius, innerRadius, points) => {
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / points;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
  };

  const drawFloatingOrbs = (ctx, width, height, progress) => {
    const orbCount = Math.floor(progress / 25) + 2;
    
    for (let i = 0; i < orbCount; i++) {
      const x = (width / (orbCount + 1)) * (i + 1);
      const y = height / 2 + Math.sin(Date.now() * 0.001 + i) * 100;
      const size = 30 + Math.sin(Date.now() * 0.002 + i) * 10;
      
      // Orb glow
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawProgressEffect = (ctx, width, height, progress) => {
    const barHeight = 8;
    const barY = height - 50;
    const barWidth = (width * progress) / 100;
    
    // Progress bar background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(0, barY, width, barHeight);
    
    // Progress bar fill
    const gradient = ctx.createLinearGradient(0, barY, barWidth, barY);
    gradient.addColorStop(0, '#FFD700');
    gradient.addColorStop(1, '#FFA500');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, barY, barWidth, barHeight);
    
    // Progress bar glow
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 20;
    ctx.fillRect(0, barY, barWidth, barHeight);
    ctx.shadowBlur = 0;
  };

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="magical-background"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  );
};

export default MagicalBackground;

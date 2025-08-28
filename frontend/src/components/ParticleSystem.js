import React, { useEffect, useRef } from 'react';
import './ParticleSystem.css';

const ParticleSystem = ({ theme = 'default' }) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);

  useEffect(() => {
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

    // Particle types based on theme
    const particleTypes = {
      default: ['✨', '🌟', '💫', '⭐', '🔮', '🎈', '🎪', '🎭'],
      positive: ['😊', '🎉', '🌈', '🌺', '🦋', '⭐', '💖', '🎊'],
      negative: ['😢', '🌧️', '☁️', '💧', '🍂', '🌙', '🌊', '❄️'],
      neutral: ['🤔', '💭', '🔍', '📚', '💡', '🎯', '⚖️', '🔬']
    };

    const currentParticles = particleTypes[theme] || particleTypes.default;

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 20 + 10;
        this.symbol = currentParticles[Math.floor(Math.random() * currentParticles.length)];
        this.opacity = Math.random() * 0.5 + 0.3;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 2;
        this.bobOffset = Math.random() * Math.PI * 2;
        this.bobSpeed = Math.random() * 0.02 + 0.01;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;
        
        // Bobbing motion
        this.y += Math.sin(this.bobOffset) * 0.5;
        this.bobOffset += this.bobSpeed;

        // Bounce off edges
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Keep particles in bounds
        this.x = Math.max(0, Math.min(width, this.x));
        this.y = Math.max(0, Math.min(height, this.y));
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.globalAlpha = this.opacity;
        ctx.font = `${this.size}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.symbol, 0, 0);
        ctx.restore();
      }
    }

    // Initialize particles
    const particleCount = 25;
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      particlesRef.current.forEach(particle => {
        particle.update();
        particle.draw();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="particle-system"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1
      }}
    />
  );
};

export default ParticleSystem;

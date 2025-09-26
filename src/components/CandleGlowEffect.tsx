'use client';

import { useEffect, useState } from 'react';

interface CandleGlowEffectProps {
  children: React.ReactNode;
  className?: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

export default function CandleGlowEffect({ children, className = '' }: CandleGlowEffectProps) {
  const [isGlowing, setIsGlowing] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const handleCandleLit = () => {
      console.log('CandleGlowEffect received candleLit event');
      setIsGlowing(true);
      
      // Create particle embers
      const newParticles: Particle[] = [];
      for (let i = 0; i < 15; i++) {
        newParticles.push({
          id: Math.random(),
          x: Math.random() * 100, // Random position across the text width
          y: 0, // Start at the top of the text
          vx: (Math.random() - 0.5) * 2, // Random horizontal velocity
          vy: -Math.random() * 3 - 1, // Upward velocity
          life: 0,
          maxLife: 60 + Math.random() * 40, // 60-100 frames
        });
      }
      setParticles(newParticles);
      console.log('Created particles:', newParticles.length);
      
      // Remove the glow class after animation completes
      setTimeout(() => {
        setIsGlowing(false);
        setParticles([]);
      }, 3000); // Match the animation duration
    };

    window.addEventListener('candleLit', handleCandleLit);
    
    return () => {
      window.removeEventListener('candleLit', handleCandleLit);
    };
  }, []);

  // Update particles
  useEffect(() => {
    if (particles.length === 0) return;

    const interval = setInterval(() => {
      setParticles(prev => 
        prev
          .map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            life: particle.life + 1,
            // No gravity - particles float upward and fade out
          }))
          .filter(particle => particle.life < particle.maxLife)
      );
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [particles.length]);

  return (
    <div className={`relative ${className}`}>
      <div className={isGlowing ? 'golden-glow' : ''} style={{ color: isGlowing ? '#DAA520' : 'inherit' }}>
        {children}
      </div>
      
      {/* Particle Embers */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute pointer-events-none golden-ember"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}px`,
            opacity: 1 - (particle.life / particle.maxLife),
            transform: `scale(${1 - (particle.life / particle.maxLife) * 0.5})`,
          }}
        >
          ✨
        </div>
      ))}
    </div>
  );
}

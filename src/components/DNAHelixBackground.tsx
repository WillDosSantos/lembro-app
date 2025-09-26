'use client';

import { useEffect, useState } from 'react';

interface Dot {
  id: number;
  baseX: number;
  baseY: number;
  size: number;
  opacity: number;
  delay: number;
  speed: number;
  phase: number;
}

export default function DNAHelixBackground() {
  const [dots, setDots] = useState<Dot[]>([]);
  const [animationTime, setAnimationTime] = useState(0);

  useEffect(() => {
    // Generate DNA helix pattern dots
    const helixDots: Dot[] = [];
    const centerX = 50; // Center of the container
    const amplitude = 8; // Width of the helix
    const frequency = 0.2; // How tight the helix is
    const dotSpacing = 0.5; // Vertical spacing between dots (reduced from 1)
    const numDots = 120; // Number of dots per helix strand (doubled from 60)
    
    // Create two helix strands
    for (let strand = 0; strand < 2; strand++) {
      const strandOffset = strand === 0 ? -amplitude : amplitude;
      
      for (let i = 0; i < numDots; i++) {
        const baseY = (i * dotSpacing) + 10; // Start from top with some margin
        const baseX = centerX + strandOffset * Math.sin(i * frequency);
        
        helixDots.push({
          id: strand * numDots + i,
          baseX: Math.max(5, Math.min(95, baseX)), // Keep within bounds
          baseY: Math.max(5, Math.min(95, baseY)), // Keep within bounds
          size: 2 + Math.random() * 2, // Random size between 2-4px
          opacity: 0.3 + Math.random() * 0.4, // Random opacity between 0.3-0.7
          delay: Math.random() * 2000, // Random delay up to 2 seconds
          speed: 0.5 + Math.random() * 1, // Random speed between 0.5-1.5
          phase: Math.random() * Math.PI * 2, // Random phase offset
        });
      }
    }

    setDots(helixDots);
  }, []);

  // Animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationTime(prev => prev + 0.02); // Increment animation time
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center">
      <div className="relative w-full max-w-[800px] h-full transform rotate-[30deg]">
        {dots.map((dot) => {
          // Calculate dynamic position based on animation time
          const time = animationTime * dot.speed + dot.phase;
          const waveOffset = Math.sin(time) * 2; // Small horizontal wave
          const verticalFlow = (time * 0.1) % 100; // Vertical flow
          
          // Calculate current position
          const currentX = dot.baseX + waveOffset;
          const currentY = (dot.baseY + verticalFlow) % 100;
          
          // Dynamic opacity based on position in helix
          const dynamicOpacity = dot.opacity * (0.5 + 0.5 * Math.sin(time * 2));
          
          // Dynamic size pulsing
          const dynamicSize = dot.size * (0.8 + 0.4 * Math.sin(time * 3));
          
          return (
            <div
              key={dot.id}
              className="absolute rounded-full transition-all duration-100"
              style={{
                left: `${currentX}%`,
                top: `${currentY}%`,
                width: `${dynamicSize}px`,
                height: `${dynamicSize}px`,
                backgroundColor: '#3b82f680',
                opacity: dynamicOpacity,
                transform: `translate(-50%, -50%)`,
              }}
            />
          );
        })}
      
        {/* Additional floating dots for more organic feel */}
        {Array.from({ length: 30 }).map((_, i) => {
          const baseX = 10 + (i * 5.3) % 80; // Distribute across width
          const baseY = 10 + (i * 6.7) % 80; // Distribute across height
          const time = animationTime * (0.3 + i * 0.1);
          
          const floatX = baseX + Math.sin(time + i) * 3;
          const floatY = baseY + Math.cos(time + i * 0.7) * 2;
          const floatOpacity = 0.2 + 0.3 * Math.sin(time * 1.5 + i);
          const floatSize = 1 + Math.sin(time * 2 + i) * 0.5;
          
          return (
            <div
              key={`floating-${i}`}
              className="absolute rounded-full transition-all duration-100"
              style={{
                left: `${floatX}%`,
                top: `${floatY}%`,
                width: `${floatSize}px`,
                height: `${floatSize}px`,
                backgroundColor: '#3b82f680',
                opacity: floatOpacity,
                transform: `translate(-50%, -50%)`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';

interface Pin {
  id: number;
  x: number; // percentage from left
  y: number; // percentage from top
  delay: number; // animation delay in ms
}

export default function AnimatedPins() {
  const [visiblePins, setVisiblePins] = useState<number[]>([]);

  const pins: Pin[] = [
    { id: 1, x: 15, y: 64, delay: 500 },   // North America
    { id: 2, x: 35, y: 83, delay: 1000 },  // Europe
    { id: 3, x: 75, y: 60, delay: 1500 },  // Asia
    { id: 4, x: 25, y: 60, delay: 2000 },  // South America
    { id: 5, x: 60, y: 70, delay: 2500 },  // Australia
  ];

  useEffect(() => {
    pins.forEach((pin) => {
      const timer = setTimeout(() => {
        setVisiblePins((prev) => [...prev, pin.id]);
      }, pin.delay);

      return () => clearTimeout(timer);
    });
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      {pins.map((pin) => (
        <div
          key={pin.id}
          className="absolute transform -translate-x-1/2 -translate-y-full"
          style={{
            left: `${pin.x}%`,
            top: `${pin.y}%`,
            zIndex: 30,
          }}
        >
          <div
            className={`transition-all duration-500 ease-out ${
              visiblePins.includes(pin.id)
                ? 'opacity-100 scale-100 translate-y-0'
                : 'opacity-0 scale-75 translate-y-4'
            }`}
          >
            {/* Pin Icon */}
            <div className="relative">
              <img
                src="/pin.svg"
                alt="Location pin"
                width="50"
                height="67"
                className="drop-shadow-lg"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

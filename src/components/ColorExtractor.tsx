'use client';

import { useEffect, useState } from 'react';

interface ColorExtractorProps {
  imageUrl: string;
  onColorExtracted: (colors: string[]) => void;
}

export default function ColorExtractor({ imageUrl, onColorExtracted }: ColorExtractorProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!imageUrl) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size to a smaller size for performance
        canvas.width = 50;
        canvas.height = 50;
        
        // Draw the image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Sample colors from the image
        const colors: string[] = [];
        const step = Math.floor(data.length / 4 / 20); // Sample 20 colors
        
        for (let i = 0; i < data.length; i += step * 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];
          
          // Only include colors with sufficient opacity
          if (a > 128) {
            colors.push(`rgb(${r}, ${g}, ${b})`);
          }
        }
        
        onColorExtracted(colors);
        setIsLoaded(true);
      } catch (error) {
        console.error('Error extracting colors:', error);
        // Fallback to default colors
        onColorExtracted(['rgb(139, 69, 19)', 'rgb(160, 82, 45)', 'rgb(210, 180, 140)']);
      }
    };

    img.onerror = () => {
      // Fallback to default colors
      onColorExtracted(['rgb(139, 69, 19)', 'rgb(160, 82, 45)', 'rgb(210, 180, 140)']);
    };

    img.src = imageUrl;
  }, [imageUrl, onColorExtracted]);

  return null; // This component doesn't render anything
}

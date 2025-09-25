'use client';

import { useState } from 'react';

interface LifePhoto {
  filename: string;
  description?: string;
}

interface PhotoCarouselProps {
  photos: LifePhoto[];
}

export default function PhotoCarousel({ photos }: PhotoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, photos.length - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="mt-40">
      <div className="text-center mb-12">
        <h2 className="text-xl font-semibold text-center mb-4 uppercase" style={{ letterSpacing: '0.28em' }}>Captured Moments</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          A visual journey through the precious memories and moments that defined their life
        </p>
      </div>

      {/* Photo Carousel */}
      <div className="relative max-w-6xl mx-auto">
        <div className="relative overflow-hidden rounded-lg">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {photos.map((photo: LifePhoto, index: number) => (
              <div key={index} className="w-full flex-shrink-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-8">
                  <div className="order-2 lg:order-1">
                    <img
                      src={`/uploads/${photo.filename}`}
                      alt={`Life photo ${index + 1}`}
                      className="w-full h-[500px] object-cover rounded-lg shadow-lg"
                    />
                  </div>
                  <div className="order-1 lg:order-2">
                    <div className="text-center lg:text-left">
                      <div className="text-6xl font-bold text-gray-300 mb-4">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      {photo.description && (
                        <p className="text-lg text-gray-700 leading-relaxed">
                          {photo.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={goToNext}
          disabled={currentIndex === photos.length - 1}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Timeline Pagination */}
      <div className="mt-12">
        <div className="flex items-center justify-center space-x-8 overflow-x-auto pb-4">
          {photos.map((photo: LifePhoto, index: number) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`flex-shrink-0 text-sm font-medium transition-colors duration-200 relative group ${
                currentIndex === index 
                  ? 'text-gray-800' 
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <span className="block pb-2">{String(index + 1).padStart(2, '0')}</span>
              <div className={`w-full h-0.5 transition-colors duration-200 ${
                currentIndex === index 
                  ? 'bg-gray-800' 
                  : 'bg-gray-300 group-hover:bg-gray-600'
              }`}></div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

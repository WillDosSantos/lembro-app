"use client";

import { useState, useRef } from "react";
import HTMLFlipBook from "react-pageflip";

interface StorybookPage {
  id: string;
  title: string;
  content: string;
  photo?: string;
  author?: string;
  order: number;
}

interface GeneratedStorybook {
  id: string;
  title: string;
  pages: StorybookPage[];
  createdAt: string;
  generatedBy: string;
}

interface StorybookDisplayProps {
  storybook: GeneratedStorybook;
}

export default function StorybookDisplay({ storybook }: StorybookDisplayProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const flipBookRef = useRef<any>(null);

  const sortedPages = [...storybook.pages].sort((a, b) => a.order - b.order);

  const nextPage = () => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipNext();
    }
  };

  const prevPage = () => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipPrev();
    }
  };

  const goToPage = (pageIndex: number) => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flip(pageIndex);
    }
  };

  const openBook = () => {
    setIsOpening(true);
    setTimeout(() => {
      setIsOpen(true);
      setIsOpening(false);
    }, 500);
  };

  if (!isOpen) {
    return (
      <div className="w-full py-20 mt-20" data-aos="fade-up">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-xl font-semibold text-center mb-4 uppercase" style={{ letterSpacing: '0.28em' }}>Digital Storybook</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A collection of stories and memories shared by family and friends
            </p>
          </div>
          
          <div className="flex justify-center">
            {/* Book Cover */}
            <div 
              className={`relative w-96 h-[500px] cursor-pointer transform transition-all duration-500 ease-out ${
                isOpening ? 'rotate-y-180 scale-110' : 'hover:scale-105 hover:shadow-2xl'
              }`}
              onClick={openBook}
              style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              }}
            >
              {/* Book Spine */}
              <div className="absolute left-0 top-0 w-3 h-full bg-gradient-to-b from-gray-700 to-gray-800 rounded-l-lg shadow-lg"></div>
              
              {/* Book Cover Front */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 rounded-lg shadow-2xl border-2 border-gray-300">
                {/* Decorative border */}
                <div className="absolute inset-4 border-2 border-gray-400 rounded-lg"></div>
                
                {/* Book title */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-6 shadow-lg">
                    <svg className="w-10 h-10 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 leading-tight">{storybook.title}</h2>
                  <p className="text-gray-600 text-sm leading-relaxed px-4">
                    A collection of stories and memories shared by family and friends
                  </p>
                  
                  {/* Click to open hint */}
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                    <div className="flex items-center text-gray-500 text-sm animate-pulse">
                      <span>Click to open</span>
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Book pages effect */}
              <div className="absolute inset-0 bg-white rounded-lg shadow-inner opacity-20"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-20 mt-20" data-aos="fade-up">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-xl font-semibold text-center mb-4 uppercase" style={{ letterSpacing: '0.28em' }}>Digital Storybook</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            A collection of stories and memories shared by family and friends
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => {
                // TODO: Implement PDF download functionality
                alert('PDF download feature coming soon!');
              }}
              className="flex items-center px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </button>
            
            <button
              onClick={() => {
                // TODO: Implement printed book ordering through third-party vendor
                alert('Printed book ordering feature coming soon!');
              }}
              className="flex items-center px-6 py-3 text-black border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Order Printed Book
            </button>
          </div>
        </div>

        {/* Flipbook with Container Styling */}
        <div className="flex justify-center">
          <div className="relative overflow-hidden border border-white/10 shadow-2xl rounded-4xl" style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)',
            borderRadius: '32px',
          }}>
            {/* Blurred Background Image */}
            {sortedPages[currentPage]?.photo && (
              <div
                className="absolute inset-0 w-full h-full"
                style={{
                  backgroundImage: `url('/uploads/${sortedPages[currentPage].photo}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  filter: 'blur(200px)',
                  WebkitFilter: 'blur(200px)',
                  opacity: 0.2,
                  transform: 'scale(1.1)',
                  zIndex: 1,
                }}
              />
            )}
            
            {/* Content Overlay */}
            <div className="relative z-20">
              {/* Close Button */}
              <div className="absolute top-4 right-4 z-30">
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-white/80 backdrop-blur-sm"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Flipbook Container */}
              <div className="relative bg-white/95 backdrop-blur-sm min-h-[600px] flex justify-center items-center p-4 rounded-4xl">
                {/* Navigation Arrows */}
                <button
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed z-20"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextPage}
                  disabled={currentPage === sortedPages.length}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed z-20"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <HTMLFlipBook
                  ref={flipBookRef}
                  width={600}
                  height={700}
                  size="stretch"
                  minWidth={500}
                  maxWidth={600}
                  minHeight={650}
                  maxHeight={700}
                  maxShadowOpacity={0.5}
                  showCover={true}
                  mobileScrollSupport={true}
                  className="shadow-2xl"
                  onFlip={(e) => setCurrentPage(e.data)}
                  drawShadow={true}
                  useMouseEvents={true}
                  usePortrait={false}
                >
                  {/* Cover Page */}
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-8 h-full flex flex-col justify-center items-center text-center border border-gray-300">
                    <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mb-6 shadow-lg">
                      <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">{storybook.title}</h2>
                    <p className="text-gray-600 text-base leading-relaxed px-4">
                      A collection of stories and memories shared by family and friends
                    </p>
                  </div>

                  {/* Story Pages */}
                  {sortedPages.map((page, index) => (
                    <div key={page.id} className="bg-white p-8 h-full flex flex-col overflow-y-auto border border-gray-200">
                      {/* Page Image - Full Page if Available */}
                      {page.photo && (
                        <div className="mb-6 text-center flex-1 flex flex-col justify-center">
                          <img
                            src={`/uploads/${page.photo}`}
                            alt={page.title}
                            className="w-full h-full max-w-none mx-auto rounded-lg shadow-md object-contain"
                            style={{ maxHeight: '500px' }}
                          />
                        </div>
                      )}

                      {/* Page Content */}
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                          {page.title}
                        </h3>
                        <div className="prose prose-base max-w-none text-gray-700 leading-relaxed">
                          {page.content.split('\n').map((paragraph, paragraphIndex) => (
                            <p key={paragraphIndex} className="mb-4 text-base">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </HTMLFlipBook>
              </div>

              {/* Page Indicators */}
              <div className="bg-white/90 backdrop-blur-sm rounded-b-4xl px-8 py-4 flex items-center justify-center border-t border-gray-200 mt-4">
                <div className="flex space-x-3">
                  {Array.from({ length: sortedPages.length + 1 }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToPage(index)}
                      className={`h-1 transition-colors ${
                        index === currentPage ? 'w-8 bg-gray-600' : 'w-4 bg-gray-300 hover:bg-gray-400'
                      }`}
                      style={{ borderRadius: '2px' }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

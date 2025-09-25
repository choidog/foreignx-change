import { useState, useEffect, useRef } from 'react';

interface CarouselProps {
  images: string[];
  className?: string;
  autoPlayInterval?: number; // milliseconds between slides
  pauseOnHover?: boolean;
}

export function Carousel({ 
  images, 
  className = '',
  autoPlayInterval = 3000, // 3 seconds per slide
  pauseOnHover = true
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPaused || isUserInteracting) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [images.length, autoPlayInterval, isPaused, isUserInteracting]);

  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setIsPaused(false);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsUserInteracting(true);
    // Resume auto-play after 3 seconds of no interaction
    setTimeout(() => {
      setIsUserInteracting(false);
    }, 3000);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setIsUserInteracting(true);
    
    if (e.deltaY > 0) {
      // Scroll down - next slide
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    } else {
      // Scroll up - previous slide
      setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
    }
    
    // Resume auto-play after 3 seconds of no interaction
    setTimeout(() => {
      setIsUserInteracting(false);
    }, 3000);
  };

  const handleTouchStart = () => {
    setIsUserInteracting(true);
  };

  const handleTouchEnd = () => {
    // Resume auto-play after 3 seconds of no interaction
    setTimeout(() => {
      setIsUserInteracting(false);
    }, 3000);
  };

  return (
    <div className={`carousel-container ${className}`}>
      <div 
        ref={containerRef}
        className="carousel-slideshow"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className={`carousel-slide ${index === currentIndex ? 'active' : ''}`}
          >
            <img
              src={image}
              alt={`Carousel image ${index + 1}`}
              className="carousel-image"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Slide indicators */}
      <div className="carousel-indicators">
        {images.map((_, index) => (
          <button
            key={index}
            className={`carousel-indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}


// Helper function to get all images from the foreign directory
export function getForeignImages(): string[] {
  const imageCount = 42; // Updated to match the actual number of images
  return Array.from({ length: imageCount }, (_, i) => {
    return `/foreign/${i + 1}.jpg`;
  });
}

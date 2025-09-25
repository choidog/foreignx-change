import { useEffect, useRef, useState } from 'react';

interface ScrollCarouselProps {
  images: string[];
  className?: string;
  speed?: number;
  smartSpeed?: boolean;
  autoplay?: boolean;
  autoplaySpeed?: number;
  direction?: 'ltr' | 'rtl';
  margin?: number;
}

export function ScrollCarouselComponent({ 
  images, 
  className = '',
  speed = 7,
  smartSpeed = true,
  autoplay = true,
  autoplaySpeed = 5,
  direction = 'rtl',
  margin = 10
}: ScrollCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set client-side flag
    setIsClient(true);
  }, []);

  return (
    <div className={`scroll-carousel-container ${className}`}>
      <div 
        ref={carouselRef}
        className="scroll-carousel"
        style={{
          display: 'flex',
          gap: `${margin}px`,
          overflow: 'hidden',
          // Use CSS animation for smooth scrolling
          animation: 'scroll 300s linear infinite'
        }}
      >
        {/* Duplicate images for seamless loop */}
        {images.map((image, index) => (
          <div key={`${image}-${index}`} className="scroll-carousel-slide">
            <img
              src={image}
              alt={`Scroll carousel image ${index + 1}`}
              className="scroll-carousel-image"
              loading="lazy"
              style={{
                flexShrink: 0,
                width: '300px',
                height: '400px',
                objectFit: 'cover'
              }}
            />
          </div>
        ))}
        {/* Duplicate images for seamless loop */}
        {images.map((image, index) => (
          <div key={`${image}-duplicate-${index}`} className="scroll-carousel-slide">
            <img
              src={image}
              alt={`Scroll carousel image ${index + 1}`}
              className="scroll-carousel-image"
              loading="lazy"
              style={{
                flexShrink: 0,
                width: '300px',
                height: '400px',
                objectFit: 'cover'
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper function to get a custom ordered subset of foreign images for the scroll carousel
export function getScrollCarouselImages(): string[] {
  // Define the actual filenames based on the existing files in /public/foreign/
  const allImages = [
    '/foreign/1.jpg',
    '/foreign/2.jpg',
    '/foreign/3.jpg',
    '/foreign/4.jpg',
    '/foreign/5.jpg',
    '/foreign/6.jpg',
    '/foreign/7.jpg',
    '/foreign/8.jpg',
    '/foreign/9.jpg',
    '/foreign/10.jpg',
    '/foreign/11.jpg',
    '/foreign/12.jpg',
    '/foreign/13.jpg',
    '/foreign/14.jpg',
    '/foreign/15.jpg',
    '/foreign/16.jpg',
    '/foreign/17.jpg',
    '/foreign/18.jpg',
    '/foreign/19.jpg',
    '/foreign/20.jpg',
    '/foreign/21.jpg',
    '/foreign/22.jpg',
    '/foreign/23.jpg',
    '/foreign/24.jpg',
    '/foreign/25.jpg',
    '/foreign/26.jpg',
    '/foreign/27.jpg',
    '/foreign/28.jpg',
    '/foreign/29.jpg',
    '/foreign/30.jpg',
    '/foreign/31.jpg',
    '/foreign/32.jpg',
    '/foreign/33.jpg',
    '/foreign/34.jpg',
    '/foreign/35.jpg',
    '/foreign/36.jpg',
    '/foreign/37.jpg',
    '/foreign/38.jpg',
    '/foreign/39.jpg',
    '/foreign/40.jpg',
    '/foreign/41.jpg',
    '/foreign/42.jpg'
  ];

  return allImages;
}

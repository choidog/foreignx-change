import { useEffect, useState } from 'react';

interface AnimatedSlideshowProps {
  imagePath: string;
  totalImages: number;
  transitionDuration?: number;
  imageDuration?: number;
}

export function AnimatedSlideshow({ 
  imagePath, 
  totalImages, 
  transitionDuration = 1000,
  imageDuration = 3000 
}: AnimatedSlideshowProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Generate image paths in reverse order (42.jpg → 1.jpg)
  const imagePaths = Array.from({ length: totalImages }, (_, index) => {
    const imageNumber = totalImages - index; // Reverse order: 42, 41, 40, ..., 1
    return `${imagePath}/${imageNumber}.jpg`;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => 
          (prevIndex + 1) % imagePaths.length
        );
        setIsTransitioning(false);
      }, transitionDuration / 2);
    }, imageDuration);

    return () => clearInterval(interval);
  }, [imagePaths.length, transitionDuration, imageDuration]);

  return (
    <div 
      className="animated-slideshow"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: `url(${imagePaths[currentImageIndex]})`,
        opacity: isTransitioning ? 0.5 : 1,
        transition: `opacity ${transitionDuration}ms ease-in-out`,
      }}
    />
  );
}

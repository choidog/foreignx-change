import { useState, useEffect, useRef } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const {
    threshold = 0.1,
    rootMargin = '0px 0px -100px 0px', // Increased bottom margin for better fade out timing
    triggerOnce = false
  } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;
        const intersectionRatio = entry.intersectionRatio;
        
        if (isIntersecting && intersectionRatio > threshold) {
          setIsVisible(true);
          setIsFadingOut(false);
        } else if (!isIntersecting || intersectionRatio < threshold) {
          if (triggerOnce) {
            // If triggerOnce is true, keep the element visible once it's been seen
            return;
          }
          setIsFadingOut(true);
          // Add a small delay before hiding to allow fade out animation
          setTimeout(() => {
            setIsVisible(false);
          }, 300);
        }
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { isVisible, isFadingOut, elementRef };
}

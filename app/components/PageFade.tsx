import {useState, useEffect} from 'react';

interface PageFadeProps {
  children: React.ReactNode;
  className?: string;
}

export function PageFade({children, className = ''}: PageFadeProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Trigger fade-in animation after component mounts
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100); // Small delay to ensure smooth transition
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div 
      className={className}
      style={{
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 1s ease-in-out'
      }}
    >
      {children}
    </div>
  );
}

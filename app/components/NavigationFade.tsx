import {useState, useEffect} from 'react';
import {useLocation} from 'react-router';

interface NavigationFadeProps {
  children: React.ReactNode;
}

export function NavigationFade({children}: NavigationFadeProps) {
  const [isNavigating, setIsNavigating] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Reset navigation state when location changes
    setIsNavigating(false);
  }, [location]);

  useEffect(() => {
    // Listen for navigation events (link clicks, etc.)
    const handleNavigation = () => {
      setIsNavigating(true);
    };

    // Add event listeners for navigation
    const links = document.querySelectorAll('a[href^="/"]');
    links.forEach(link => {
      link.addEventListener('click', handleNavigation);
    });

    return () => {
      links.forEach(link => {
        link.removeEventListener('click', handleNavigation);
      });
    };
  }, []);

  return (
    <div 
      style={{
        opacity: isNavigating ? 0 : 1,
        transition: 'opacity 0.5s ease-out'
      }}
    >
      {children}
    </div>
  );
}

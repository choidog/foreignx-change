import type {V2_MetaFunction} from '@shopify/remix-oxygen';
import {useState} from 'react';
import {AnimatedSlideshow} from '~/components/AnimatedSlideshow';
import SpotlightCard from '~/components/SpotlightCard';

export const meta: V2_MetaFunction = () => {
  return [{title: 'Foreign X-Change | Enter'}];
};

export default function Index() {
  console.log('Index route: Rendering entrance page');
  const [isFading, setIsFading] = useState(false);
  
  const handleEnterClick = () => {
    setIsFading(true);
    // Wait for fade animation to complete before navigating
    setTimeout(() => {
      window.location.href = '/home';
    }, 1000); // Match the transition duration
  };
  
  // Simple test version with animated slideshow background
  return (
    <>
      {/* Animated slideshow background */}
      <AnimatedSlideshow 
        imagePath="/foreign" 
        totalImages={42}
        transitionDuration={1000}
        imageDuration={3000}
      />
      
      {/* Main content overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent overlay
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '0vh', // Position content higher up on the page
        zIndex: 10,
        opacity: isFading ? 0 : 1,
        transition: 'opacity 1s ease-out'
      }}>
        <div style={{textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <img 
            src="/logo.webp" 
            alt="Foreign X-Change" 
            style={{
              width: '450px',
              height: '450px',
              objectFit: 'contain',
              marginBottom: '0',
              display: 'block'
            }}
          />
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <SpotlightCard 
              spotlightColor="rgba(0, 229, 255, 0.2)"
              className="enter-button-spotlight"
            >
              <button 
                onClick={handleEnterClick}
                style={{
                  padding: '0.5rem 2rem',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                ENTER
              </button>
            </SpotlightCard>
          </div>
        </div>
      </div>
    </>
  );
}
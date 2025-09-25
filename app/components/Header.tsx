import {Await, NavLink, useMatches} from 'react-router';
import {Suspense, useEffect, useState, useRef} from 'react';
import type {LayoutProps} from './Layout';
import type {CartApiQueryFragment} from 'storefrontapi.generated';

type HeaderProps = Pick<LayoutProps, 'header' | 'cart' | 'isLoggedIn' | 'publicStoreDomain'>;

type Viewport = 'desktop' | 'mobile';

export function Header({header, isLoggedIn, cart, publicStoreDomain}: HeaderProps) {
  const {menu} = header || {};
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show navbar when scrolling up or at the top
      if (currentScrollY < lastScrollY.current || currentScrollY < 10) {
        setIsVisible(true);
      } 
      // Hide navbar when scrolling down (but not at the very top)
      else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty dependency array is safe now since we use ref

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className={`header ${isVisible ? 'header-visible' : 'header-hidden'}`}>
        <HeaderMenu menu={menu} viewport="desktop" publicStoreDomain={publicStoreDomain} />
        <BurgerMenu onClick={toggleMobileMenu} isOpen={isMobileMenuOpen} />
        <NavLink prefetch="intent" to="/home" end className="header-logo">
          <img src="/logo.webp" alt="Foreign X-Change" className="logo" />
        </NavLink>
        <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
      </header>
      <MobileMenuOverlay 
        menu={menu} 
        isOpen={isMobileMenuOpen} 
        onClose={closeMobileMenu}
        isLoggedIn={isLoggedIn}
        cart={cart}
        publicStoreDomain={publicStoreDomain}
      />
    </>
  );
}

export function HeaderMenu({
  menu,
  viewport,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  viewport: Viewport;
  publicStoreDomain?: string;
}) {
  const className = `header-menu-${viewport}`;

  function closeAside(event: React.MouseEvent<HTMLAnchorElement>) {
    if (viewport === 'mobile') {
      event.preventDefault();
      window.location.href = event.currentTarget.href;
    }
  }

  return (
    <nav className={className} role="navigation">
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        // if the url is internal, we strip the domain
        let url =
          item.url.includes('myshopify.com') ||
          (publicStoreDomain && item.url.includes(publicStoreDomain))
            ? new URL(item.url).pathname
            : item.url;
        
        // Override Home menu item to go to /home instead of landing page
        if (item.title === 'Home' && (url === '/' || url === '')) {
          url = '/home';
        }
        return (
          <NavLink
            className="header-menu-item"
            end
            key={item.id}
            onClick={closeAside}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav className="header-ctas" role="navigation">
      <HeaderMenuMobileToggle />
      <NavLink prefetch="intent" to="/account" style={activeLinkStyle} className="header-icon" title={isLoggedIn ? 'Account' : 'Sign in'}>
        <UserIcon />
      </NavLink>
      <SearchToggle />
      <Suspense fallback={<CartBadge count={0} />}>
        <Await resolve={cart}>
          {(resolvedCart) => (
            <CartToggle cart={resolvedCart} />
          )}
        </Await>
      </Suspense>
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  return (
    <a className="header-menu-mobile-toggle" href="#mobile-menu-aside">
      <h3>☰</h3>
    </a>
  );
}

function SearchToggle() {
  return <a href="#search-aside" className="header-icon" title="Search"><SearchIcon /></a>;
}

function CartBadge({count}: {count: number}) {
  return (
    <a href="#cart-aside" className="header-icon" title="Cart">
      <CartIcon />
      {count > 0 && <span className="cart-count">{count}</span>}
    </a>
  );
}

function CartToggle({cart}: {cart: CartApiQueryFragment | null}) {
  if (!cart) return <CartBadge count={0} />;
  return <CartBadge count={cart.totalQuantity || 0} />;
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500000',
      resourceId: null,
      tags: [],
      title: 'Home',
      type: 'HTTP',
      url: '/home',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'black',
  };
}

// Icon Components
function UserIcon() {
  return (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="icon"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="icon"
    >
      <circle cx="11" cy="11" r="8"/>
      <path d="m21 21-4.35-4.35"/>
    </svg>
  );
}

function CartIcon() {
  return (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="icon"
    >
      <circle cx="9" cy="21" r="1"/>
      <circle cx="20" cy="21" r="1"/>
      <path d="m1 1 4 4 13 1 2 8H6"/>
    </svg>
  );
}

// Burger Menu Component
function BurgerMenu({onClick, isOpen}: {onClick: () => void; isOpen: boolean}) {
  return (
    <button 
      className={`burger-menu ${isOpen ? 'burger-open' : ''}`}
      onClick={onClick}
      aria-label="Toggle mobile menu"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>
  );
}

// Mobile Menu Overlay Component
function MobileMenuOverlay({
  menu,
  isOpen,
  onClose,
  isLoggedIn,
  cart,
  publicStoreDomain
}: {
  menu: HeaderProps['header']['menu'];
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: Promise<boolean>;
  cart: HeaderProps['cart'];
  publicStoreDomain?: string;
}) {

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <div className={`mobile-menu-overlay ${isOpen ? 'mobile-menu-open' : ''}`}>
      <div className="mobile-menu-content">
        <div className="mobile-menu-header">
          <button className="mobile-menu-close" onClick={onClose} aria-label="Close menu" style={{order: 1}}>
            <CloseIcon />
          </button>
          
          <NavLink prefetch="intent" to="/home" end onClick={handleLinkClick} className="mobile-menu-logo" style={{order: 2}}>
            <img src="/logo.webp" alt="Foreign X-Change" className="mobile-logo" />
          </NavLink>
          
          <div className="mobile-menu-ctas" style={{order: 3}}>
            <Suspense fallback={<div className="header-icon"><CartIcon /></div>}>
              <Await resolve={cart}>
                {(resolvedCart) => (
                  <CartToggle cart={resolvedCart} />
                )}
              </Await>
            </Suspense>
          </div>
        </div>
        
        <nav className="mobile-menu-nav">
          {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
            if (!item.url) return null;

            let url =
              item.url.includes('myshopify.com') ||
              (publicStoreDomain && item.url.includes(publicStoreDomain))
                ? new URL(item.url).pathname
                : item.url;
            
            // Override Home menu item to go to /home instead of landing page
            if (item.title === 'Home' && (url === '/' || url === '')) {
              url = '/home';
            }
            
            return (
              <NavLink
                key={item.id}
                to={url}
                onClick={handleLinkClick}
                className="mobile-menu-item"
              >
                {item.title}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}
import React from 'react';
import { Home, Compass, Search, ShoppingBag, Sparkles } from 'lucide-react';

interface MobileBottomNavProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onScrollToCollection: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  cartCount,
  onOpenCart,
  onOpenSearch,
  onScrollToCollection,
}) => {
  return (
    <nav
      className="mobile-bottom-dock"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 90,
        backgroundColor: 'rgba(12, 13, 15, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        paddingTop: '0.55rem',
        paddingBottom: 'max(0.6rem, env(safe-area-inset-bottom))',
        paddingLeft: '1rem',
        paddingRight: '1rem',
        display: 'none', // Shown via media query in index.css
        justifyContent: 'space-around',
        alignItems: 'center',
        boxShadow: '0 -10px 25px rgba(0, 0, 0, 0.7)',
      }}
      aria-label="Mobile Navigation Dock"
    >
      {/* Home / Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={navBtnStyle}
        aria-label="Home"
      >
        <Home size={19} />
        <span style={navTextStyle}>Home</span>
      </button>

      {/* Collection */}
      <button
        onClick={onScrollToCollection}
        style={navBtnStyle}
        aria-label="Collection"
      >
        <Compass size={19} />
        <span style={navTextStyle}>Archive</span>
      </button>

      {/* Search */}
      <button
        onClick={onOpenSearch}
        style={navBtnStyle}
        aria-label="Search"
      >
        <Search size={19} />
        <span style={navTextStyle}>Search</span>
      </button>

      {/* Cart with Live Counter */}
      <button
        onClick={onOpenCart}
        style={{ ...navBtnStyle, position: 'relative' }}
        aria-label="Cart"
      >
        <div style={{ position: 'relative' }}>
          <ShoppingBag size={19} color="#FFA578" />
          {cartCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-6px',
                right: '-9px',
                backgroundColor: 'var(--color-terracotta)',
                color: '#FFFFFF',
                borderRadius: '50%',
                fontSize: '0.62rem',
                fontWeight: 800,
                width: '17px',
                height: '17px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 6px rgba(200, 98, 55, 0.8)',
              }}
            >
              {cartCount}
            </span>
          )}
        </div>
        <span style={{ ...navTextStyle, color: '#FFA578' }}>Bag</span>
      </button>

      {/* Craftsmanship */}
      <button
        onClick={() => {
          const el = document.getElementById('craftsmanship');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        style={navBtnStyle}
        aria-label="Craftsmanship"
      >
        <Sparkles size={19} />
        <span style={navTextStyle}>Craft</span>
      </button>
    </nav>
  );
};

const navBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--color-text-secondary)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.2rem',
  cursor: 'pointer',
  padding: '0.3rem 0.6rem',
  minWidth: '54px',
  WebkitTapHighlightColor: 'transparent',
};

const navTextStyle: React.CSSProperties = {
  fontSize: '0.62rem',
  fontFamily: 'var(--font-display)',
  fontWeight: 700,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
};

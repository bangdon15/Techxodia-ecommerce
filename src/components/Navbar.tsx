import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Globe, Menu, X } from 'lucide-react';
import { CurrencyCode } from '../types';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  activeCurrency: CurrencyCode;
  onCurrencyChange: (currency: CurrencyCode) => void;
  brandName?: string;
  brandTagline?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenSearch,
  activeCurrency,
  onCurrencyChange,
  brandName = 'TECHXODIA',
  brandTagline = 'SERIES 01 // ARCHIVE',
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: isScrolled
          ? 'rgba(255, 255, 255, 0.98)'
          : 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid #E4E4E7',
        transition: 'all 0.3s ease',
      }}
    >
      <div
        className="container-luxury navbar-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '76px',
        }}
      >
        {/* Left: Mobile Toggle & Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexShrink: 0 }}>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              color: '#000000',
              cursor: 'pointer',
              padding: '0.4rem',
            }}
            className="mobile-only-btn"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.8rem',
            }}
            className="desktop-nav-links"
          >
            <button
              onClick={() => scrollToSection('collection')}
              style={navLinkStyle}
            >
              COLLECTION
            </button>
            <button
              onClick={() => scrollToSection('craftsmanship')}
              style={navLinkStyle}
            >
              CRAFTSMANSHIP
            </button>
            <button
              onClick={() => scrollToSection('specifications')}
              style={navLinkStyle}
            >
              SPECS
            </button>
            <button
              onClick={() => scrollToSection('lookbook')}
              style={navLinkStyle}
            >
              LOOKBOOK
            </button>
          </nav>
        </div>

        {/* Center: Brand Logo */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="nav-brand-logo"
          style={{
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            userSelect: 'none',
            flexShrink: 1,
            minWidth: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* Techxodia Geometric Crest SVG */}
            <svg
              width="22"
              height="22"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ flexShrink: 0 }}
            >
              <polygon
                points="50,10 90,30 90,70 50,90 10,70 10,30"
                stroke="#000000"
                strokeWidth="8"
                fill="none"
              />
              <polygon
                points="50,26 76,40 76,60 50,74 24,60 24,40"
                fill="#000000"
              />
              <circle cx="50" cy="50" r="8" fill="#FFFFFF" />
            </svg>
            <span
              className="nav-brand-name"
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: '1.25rem',
                letterSpacing: '0.18em',
                color: '#000000',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}
            >
              {brandName}
            </span>
          </div>
          <span
            className="nav-brand-tagline"
            style={{
              fontSize: '0.54rem',
              letterSpacing: '0.28em',
              color: '#52525B',
              fontWeight: 700,
              textTransform: 'uppercase',
              marginTop: '-2px',
              whiteSpace: 'nowrap',
            }}
          >
            {brandTagline}
          </span>
        </div>

        {/* Right: Tools & Cart */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
          {/* Currency Switcher (Desktop) */}
          <div className="nav-currency-switcher" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Globe size={14} style={{ color: '#52525B', marginRight: '4px' }} />
            <select
              value={activeCurrency}
              onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
              style={{
                background: '#F4F4F5',
                border: '1px solid #E4E4E7',
                borderRadius: 'var(--radius-xs)',
                color: '#000000',
                fontSize: '0.74rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                letterSpacing: '0.08em',
                cursor: 'pointer',
                outline: 'none',
                padding: '0.35rem 0.5rem',
              }}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>

          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="nav-search-btn"
            style={{
              background: '#F4F4F5',
              border: '1px solid #E4E4E7',
              borderRadius: 'var(--radius-xs)',
              color: '#000000',
              cursor: 'pointer',
              padding: '0.45rem',
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.2s',
            }}
            aria-label="Search Collection"
          >
            <Search size={17} />
          </button>

          {/* Cart Drawer Trigger */}
          <button
            onClick={onOpenCart}
            className="nav-cart-btn"
            style={{
              position: 'relative',
              background: '#000000',
              border: '1px solid #000000',
              color: '#FFFFFF',
              cursor: 'pointer',
              padding: '0.55rem 0.95rem',
              borderRadius: 'var(--radius-xs)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '0.75rem',
              letterSpacing: '0.12em',
              transition: 'all 0.2s ease',
            }}
            aria-label="Open Cart"
          >
            <ShoppingBag size={15} />
            <span className="nav-cart-text" style={{ marginTop: '1px' }}>BAG</span>
            {cartCount > 0 && (
              <span
                style={{
                  background: '#FFFFFF',
                  color: '#000000',
                  borderRadius: '50%',
                  minWidth: '18px',
                  height: '18px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '0 3px',
                }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid #E4E4E7',
            borderBottom: '1px solid #E4E4E7',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.2rem',
            animation: 'slideDown 0.25s ease-out',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
          }}
        >
          <button
            onClick={() => scrollToSection('collection')}
            style={mobileNavLinkStyle}
          >
            THE COLLECTION
          </button>
          <button
            onClick={() => scrollToSection('craftsmanship')}
            style={mobileNavLinkStyle}
          >
            CRAFTSMANSHIP
          </button>
          <button
            onClick={() => scrollToSection('specifications')}
            style={mobileNavLinkStyle}
          >
            SPECIFICATIONS
          </button>
          <button
            onClick={() => scrollToSection('lookbook')}
            style={mobileNavLinkStyle}
          >
            LOOKBOOK
          </button>

          {/* Currency Switcher in Mobile Drawer */}
          <div
            style={{
              paddingTop: '1rem',
              borderTop: '1px solid #E4E4E7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#18181B' }}>
              <Globe size={16} />
              <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-display)', fontWeight: 600 }}>Active Currency</span>
            </div>
            <select
              value={activeCurrency}
              onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
              style={{
                background: '#F4F4F5',
                border: '1px solid #E4E4E7',
                color: '#000000',
                borderRadius: 'var(--radius-xs)',
                padding: '0.4rem 0.7rem',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                outline: 'none',
              }}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 860px) {
          .desktop-nav-links { display: none !important; }
        }
        @media (min-width: 861px) {
          .mobile-only-btn { display: none !important; }
        }
        @media (max-width: 768px) {
          .navbar-container {
            height: 62px !important;
            padding-left: 0.85rem !important;
            padding-right: 0.85rem !important;
          }
          .nav-currency-switcher {
            display: none !important;
          }
          .nav-cart-text {
            display: none !important;
          }
          .nav-cart-btn {
            padding: 0.45rem 0.6rem !important;
            gap: 0.25rem !important;
          }
          .nav-brand-name {
            font-size: 1.05rem !important;
            letter-spacing: 0.12em !important;
          }
          .nav-brand-tagline {
            font-size: 0.46rem !important;
            letter-spacing: 0.18em !important;
          }
        }
      `}</style>
    </header>
  );
};

const navLinkStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#18181B',
  fontFamily: 'var(--font-display)',
  fontSize: '0.75rem',
  fontWeight: 700,
  letterSpacing: '0.14em',
  cursor: 'pointer',
  transition: 'color 0.2s ease',
  padding: '0.4rem 0',
};

const mobileNavLinkStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  textAlign: 'left',
  color: '#000000',
  fontFamily: 'var(--font-display)',
  fontSize: '0.95rem',
  fontWeight: 800,
  letterSpacing: '0.14em',
  padding: '0.5rem 0',
  cursor: 'pointer',
};

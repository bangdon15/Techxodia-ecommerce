import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Database, Globe, Menu, X, Sliders } from 'lucide-react';
import { CurrencyCode } from '../types';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenSupabaseModal: () => void;
  onOpenAdmin: () => void;
  supabaseSource: 'supabase' | 'fallback';
  activeCurrency: CurrencyCode;
  onCurrencyChange: (currency: CurrencyCode) => void;
  brandName?: string;
  brandTagline?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenSearch,
  onOpenSupabaseModal,
  onOpenAdmin,
  supabaseSource,
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
          ? 'rgba(12, 13, 15, 0.94)'
          : 'rgba(12, 13, 15, 0.8)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        transition: 'all 0.3s ease',
      }}
    >
      <div
        className="container-luxury"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '76px',
        }}
      >
        {/* Left: Mobile Toggle & Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              color: 'var(--color-text-primary)',
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
          style={{
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            userSelect: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {/* Techxodia Geometric Crest SVG */}
            <svg
              width="26"
              height="26"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polygon
                points="50,10 90,30 90,70 50,90 10,70 10,30"
                stroke="#C86237"
                strokeWidth="7"
                fill="none"
              />
              <polygon
                points="50,26 76,40 76,60 50,74 24,60 24,40"
                fill="#C86237"
              />
              <circle cx="50" cy="50" r="8" fill="#0C0D0F" />
            </svg>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: '1.35rem',
                letterSpacing: '0.22em',
                color: '#FFFFFF',
                textTransform: 'uppercase',
              }}
            >
              {brandName}
            </span>
          </div>
          <span
            style={{
              fontSize: '0.58rem',
              letterSpacing: '0.35em',
              color: 'var(--color-terracotta)',
              fontWeight: 700,
              textTransform: 'uppercase',
              marginTop: '-2px',
            }}
          >
            {brandTagline}
          </span>
        </div>

        {/* Right: Tools & Cart */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          {/* Admin Control Portal Button */}
          <button
            onClick={onOpenAdmin}
            title="Open Master Admin Control Portal"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: 'rgba(200, 98, 55, 0.15)',
              border: '1px solid rgba(200, 98, 55, 0.4)',
              padding: '0.4rem 0.8rem',
              borderRadius: 'var(--radius-xs)',
              color: '#FFA578',
              fontSize: '0.72rem',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              letterSpacing: '0.12em',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <Sliders size={13} />
            <span style={{ marginTop: '1px' }}>ADMIN</span>
          </button>

          {/* Supabase Status Pill */}
          <button
            onClick={onOpenSupabaseModal}
            title={
              supabaseSource === 'supabase'
                ? 'Connected directly to Supabase DB'
                : 'Running in Demo Mode (Click to configure Supabase)'
            }
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '0.35rem 0.65rem',
              borderRadius: 'var(--radius-pill)',
              color: 'var(--color-text-primary)',
              fontSize: '0.68rem',
              fontWeight: 600,
              fontFamily: 'var(--font-display)',
              letterSpacing: '0.08em',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor:
                  supabaseSource === 'supabase' ? '#10B981' : '#F59E0B',
                boxShadow:
                  supabaseSource === 'supabase'
                    ? '0 0 8px #10B981'
                    : '0 0 8px #F59E0B',
              }}
            />
            <Database size={12} style={{ color: 'var(--color-text-secondary)' }} />
            <span style={{ display: 'inline' }}>
              {supabaseSource === 'supabase' ? 'SUPABASE: LIVE' : 'SUPABASE SETUP'}
            </span>
          </button>

          {/* Currency Switcher */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Globe size={14} style={{ color: 'var(--color-text-muted)', marginRight: '4px' }} />
            <select
              value={activeCurrency}
              onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-text-secondary)',
                fontSize: '0.74rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                letterSpacing: '0.08em',
                cursor: 'pointer',
                outline: 'none',
                paddingRight: '0.2rem',
              }}
            >
              <option value="USD" style={{ background: '#14161A', color: '#FFF' }}>USD ($)</option>
              <option value="EUR" style={{ background: '#14161A', color: '#FFF' }}>EUR (€)</option>
              <option value="GBP" style={{ background: '#14161A', color: '#FFF' }}>GBP (£)</option>
              <option value="JPY" style={{ background: '#14161A', color: '#FFF' }}>JPY (¥)</option>
            </select>
          </div>

          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-primary)',
              cursor: 'pointer',
              padding: '0.45rem',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.2s',
            }}
            aria-label="Search Collection"
          >
            <Search size={18} />
          </button>

          {/* Cart Drawer Trigger */}
          <button
            onClick={onOpenCart}
            style={{
              position: 'relative',
              background: 'var(--color-terracotta)',
              border: 'none',
              color: '#FFFFFF',
              cursor: 'pointer',
              padding: '0.55rem 0.95rem',
              borderRadius: 'var(--radius-xs)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '0.75rem',
              letterSpacing: '0.12em',
              transition: 'all 0.2s ease',
            }}
            aria-label="Open Cart"
          >
            <ShoppingBag size={15} />
            <span style={{ marginTop: '1px' }}>BAG</span>
            {cartCount > 0 && (
              <span
                style={{
                  background: '#FFFFFF',
                  color: '#C86237',
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
            backgroundColor: '#121316',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.2rem',
            animation: 'slideDown 0.25s ease-out',
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
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenAdmin();
            }}
            style={{
              ...mobileNavLinkStyle,
              color: '#FFA578',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Sliders size={16} />
            <span>ADMIN CONTROL PORTAL (WALLPAPER, DB, PRODUCTS)</span>
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenSupabaseModal();
            }}
            style={{
              ...mobileNavLinkStyle,
              color: 'var(--color-terracotta-light)',
            }}
          >
            SUPABASE DATABASE SETTINGS
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 860px) {
          .desktop-nav-links { display: none !important; }
        }
        @media (min-width: 861px) {
          .mobile-only-btn { display: none !important; }
        }
      `}</style>
    </header>
  );
};

const navLinkStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--color-text-secondary)',
  fontFamily: 'var(--font-display)',
  fontSize: '0.75rem',
  fontWeight: 600,
  letterSpacing: '0.14em',
  cursor: 'pointer',
  transition: 'color 0.2s ease',
  padding: '0.4rem 0',
};

const mobileNavLinkStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  textAlign: 'left',
  color: '#FFFFFF',
  fontFamily: 'var(--font-display)',
  fontSize: '0.95rem',
  fontWeight: 700,
  letterSpacing: '0.14em',
  padding: '0.5rem 0',
  cursor: 'pointer',
};

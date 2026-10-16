import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Heart } from 'lucide-react';

interface FooterProps {
  onNavigateAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateAdmin }) => {
  return (
    <footer
      style={{
        backgroundColor: '#000000',
        color: '#A1A1AA',
        borderTop: '1px solid #27272A',
        paddingTop: '4.5rem',
        paddingBottom: '3rem',
      }}
    >
      <div className="container-luxury">
        {/* Trust Badges Banner */}
        <div
          className="footer-trust-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2rem',
            paddingBottom: '3.5rem',
            marginBottom: '3.5rem',
            borderBottom: '1px solid #27272A',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <ShieldCheck size={28} style={{ color: '#FFFFFF', flexShrink: 0 }} />
            <div>
              <h5 style={{ color: '#FFFFFF', fontSize: '0.88rem', textTransform: 'uppercase', marginBottom: '0.1rem' }}>
                BUILT FOR ETERNITY
              </h5>
              <p style={{ fontSize: '0.75rem', color: '#71717A' }}>
                Lifetime performance guarantee on all steel vessels.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <Truck size={28} style={{ color: '#FFFFFF', flexShrink: 0 }} />
            <div>
              <h5 style={{ color: '#FFFFFF', fontSize: '0.88rem', textTransform: 'uppercase', marginBottom: '0.1rem' }}>
                GLOBAL EXPRESS
              </h5>
              <p style={{ fontSize: '0.75rem', color: '#71717A' }}>
                Carbon-neutral courier dispatch on orders over $75.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <RotateCcw size={28} style={{ color: '#FFFFFF', flexShrink: 0 }} />
            <div>
              <h5 style={{ color: '#FFFFFF', fontSize: '0.88rem', textTransform: 'uppercase', marginBottom: '0.1rem' }}>
                HASSLE-FREE RETURNS
              </h5>
              <p style={{ fontSize: '0.75rem', color: '#71717A' }}>
                30-day unconditioned return window for unused archive gear.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div
          className="footer-nav-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '2.5rem',
            marginBottom: '4rem',
          }}
        >
          {/* Brand Col */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}>
              <svg width="22" height="22" viewBox="0 0 100 100" fill="none">
                <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" stroke="#FFFFFF" strokeWidth="8" />
                <polygon points="50,26 76,40 76,60 50,74 24,60 24,40" fill="#FFFFFF" />
              </svg>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 900,
                  fontSize: '1.15rem',
                  letterSpacing: '0.18em',
                  color: '#FFFFFF',
                }}
              >
                TECHXODIA
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#71717A', lineHeight: 1.6, maxWidth: '240px' }}>
              Architectural drinkware & outdoor lifestyle objects built with aerospace-grade metallurgy and timeless aesthetic discipline.
            </p>
          </div>

          {/* Links 1 */}
          <div>
            <h5 style={footerHeadingStyle}>COLLECTIONS</h5>
            <ul style={footerListStyle}>
              <li><a href="#collection" style={footerLinkStyle}>Horizon Pro Jugs</a></li>
              <li><a href="#collection" style={footerLinkStyle}>Wellspring Flasks</a></li>
              <li><a href="#collection" style={footerLinkStyle}>Field Lunch Vaults</a></li>
              <li><a href="#collection" style={footerLinkStyle}>Pocket Spirit Sets</a></li>
              <li><a href="#collection" style={footerLinkStyle}>Pet Oasis Dishes</a></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h5 style={footerHeadingStyle}>CRAFTSMANSHIP</h5>
            <ul style={footerListStyle}>
              <li><a href="#craftsmanship" style={footerLinkStyle}>Vacuum CryoLock™</a></li>
              <li><a href="#specifications" style={footerLinkStyle}>18/8 Recycled Steel</a></li>
              <li><a href="#lookbook" style={footerLinkStyle}>Architectural Palette</a></li>
              <li><a href="#specifications" style={footerLinkStyle}>Lifetime Guarantee</a></li>
            </ul>
          </div>

          {/* Links 3 */}
          <div>
            <h5 style={footerHeadingStyle}>SUPPORT & LEGAL</h5>
            <ul style={footerListStyle}>
              <li><a href="#specifications" style={footerLinkStyle}>Care & Dishwashing</a></li>
              <li><a href="#specifications" style={footerLinkStyle}>Warranty Claims</a></li>
              <li><a href="#" style={footerLinkStyle}>Privacy Policy</a></li>
              <li><a href="#" style={footerLinkStyle}>Terms of Collaboration</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div
          style={{
            borderTop: '1px solid #27272A',
            paddingTop: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            fontSize: '0.74rem',
            color: '#71717A',
          }}
        >
          <span>
            © {new Date().getFullYear()} TECHXODIA LLC. ALL RIGHTS RESERVED. SIGNATURE SERIES 01.
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
            <span>Powered by Supabase Cloud & Vercel</span>
            <span style={{ color: 'rgba(255,255,255,0.15)' }}>•</span>
            <a
              href="#/admin"
              onClick={(e) => {
                e.preventDefault();
                if (onNavigateAdmin) onNavigateAdmin();
                else window.location.hash = '/admin';
              }}
              style={{
                color: '#A1A1AA',
                textDecoration: 'none',
                cursor: 'pointer',
                fontSize: '0.72rem',
                letterSpacing: '0.04em',
              }}
              title="Staff Management Portal"
            >
              Staff Console
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const footerHeadingStyle: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: '0.74rem',
  fontWeight: 800,
  letterSpacing: '0.14em',
  color: '#FFFFFF',
  textTransform: 'uppercase',
  marginBottom: '1rem',
};

const footerListStyle: React.CSSProperties = {
  listStyle: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.6rem',
};

const footerLinkStyle: React.CSSProperties = {
  color: 'var(--color-text-secondary)',
  textDecoration: 'none',
  fontSize: '0.8rem',
  transition: 'color 0.2s',
};

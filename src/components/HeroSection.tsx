import React from 'react';
import { ArrowDown, Flame, Shield, Clock } from 'lucide-react';

interface HeroSectionProps {
  onExploreClick: () => void;
  onCraftClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreClick,
  onCraftClick,
}) => {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '88vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: '#0C0D0F',
      }}
    >
      {/* Background Hero Image with Film Grain Gradient Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(/assets/hero_collab.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 35%',
          opacity: 0.85,
        }}
      />

      {/* Luxury Cinematic Vignette & Gradients */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            linear-gradient(180deg, rgba(12, 13, 15, 0.75) 0%, rgba(12, 13, 15, 0.4) 40%, rgba(12, 13, 15, 0.95) 100%),
            linear-gradient(90deg, rgba(12, 13, 15, 0.92) 0%, rgba(12, 13, 15, 0.6) 50%, rgba(12, 13, 15, 0.2) 100%)
          `,
        }}
      />

      {/* Hero Content Container */}
      <div
        className="container-luxury"
        style={{
          position: 'relative',
          zIndex: 10,
          paddingTop: '4rem',
          paddingBottom: '4rem',
          width: '100%',
        }}
      >
        <div style={{ maxWidth: '780px' }}>
          {/* Eyebrow / Collaboration Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              marginBottom: '1.4rem',
              backgroundColor: 'rgba(200, 98, 55, 0.18)',
              border: '1px solid rgba(200, 98, 55, 0.4)',
              padding: '0.45rem 1rem',
              borderRadius: 'var(--radius-xs)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Flame size={14} style={{ color: '#FFA578' }} />
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.74rem',
                fontWeight: 800,
                letterSpacing: '0.18em',
                color: '#FFA578',
                textTransform: 'uppercase',
              }}
            >
              TECHXODIA × SIGNATURE ARCHIVE // LIMITED RUN 001
            </span>
          </div>

          {/* Main Title */}
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5.8vw, 4.8rem)',
              fontWeight: 900,
              lineHeight: 1.02,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: '#FFFFFF',
              marginBottom: '1.4rem',
            }}
          >
            DESIGNED FOR CALM <br />
            <span
              style={{
                background: 'linear-gradient(90deg, #FFFFFF 0%, #D8CEBC 50%, #C86237 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              IN THE CLAMOR.
            </span>
          </h1>

          {/* Subtitle / Storytelling */}
          <p
            style={{
              fontSize: 'clamp(1rem, 1.3vw, 1.2rem)',
              color: 'var(--color-sand)',
              lineHeight: 1.6,
              marginBottom: '2.4rem',
              maxWidth: '640px',
              fontWeight: 400,
              textShadow: '0 2px 10px rgba(0,0,0,0.6)',
            }}
          >
            Crafted at the intersection of quiet luxury and relentless thermal utility.
            Wrapped in baked desert terracotta ceramic and dual-barrier recycled stainless
            steel—engineered for everyday rituals and high-stakes performance.
          </p>

          {/* Action CTAs */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              alignItems: 'center',
              marginBottom: '3.5rem',
            }}
          >
            <button
              onClick={onExploreClick}
              className="btn-primary"
              style={{ minWidth: '220px' }}
            >
              <span>SHOP THE DROP</span>
              <ArrowDown size={16} />
            </button>
            <button
              onClick={onCraftClick}
              className="btn-secondary"
              style={{ minWidth: '200px' }}
            >
              DISCOVER CRAFT
            </button>
          </div>

          {/* Key Metric Highlights Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '1.2rem',
              maxWidth: '650px',
              borderTop: '1px solid rgba(255, 255, 255, 0.12)',
              paddingTop: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  letterSpacing: '0.04em',
                }}
              >
                36 HRS
              </span>
              <span
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--color-text-secondary)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                Sub-Zero TempLock™
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  letterSpacing: '0.04em',
                }}
              >
                18/8 STEEL
              </span>
              <span
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--color-text-secondary)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                90% Recycled Metal
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  letterSpacing: '0.04em',
                }}
              >
                100%
              </span>
              <span
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--color-text-secondary)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                Leakproof Flip Cap
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  letterSpacing: '0.04em',
                }}
              >
                LIFETIME
              </span>
              <span
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--color-text-secondary)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                Product Guarantee
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

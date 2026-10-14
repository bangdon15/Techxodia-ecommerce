import React from 'react';
import { Layers, Droplets, Shield, Compass } from 'lucide-react';

export const StorySplit: React.FC = () => {
  return (
    <section
      id="craftsmanship"
      style={{
        paddingTop: '6rem',
        paddingBottom: '6rem',
        backgroundColor: '#111215',
        position: 'relative',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div className="container-luxury">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '4rem',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Macro Craft Editorial Photography */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                borderRadius: 'var(--radius-xs)',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                position: 'relative',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
              }}
            >
              <img
                src="/assets/editorial_craft_detail.jpg"
                alt="Techxodia Thermal Craftsmanship Detail"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  transition: 'transform 0.6s ease',
                }}
              />

              {/* Laser-engraved Emblem Overlay Badge */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '20px',
                  backgroundColor: 'rgba(12, 13, 15, 0.92)',
                  border: '1px solid rgba(200, 98, 55, 0.4)',
                  padding: '0.8rem 1.2rem',
                  borderRadius: 'var(--radius-xs)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.64rem',
                    fontWeight: 700,
                    letterSpacing: '0.2em',
                    color: '#FFA578',
                    textTransform: 'uppercase',
                  }}
                >
                  ENGINEERING NOTE #001
                </span>
                <span
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  Laser-Inscribed Monolith Insignia
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Story Copy and Feature Callout Pillars */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: 'var(--color-terracotta)',
                fontFamily: 'var(--font-display)',
                fontSize: '0.74rem',
                fontWeight: 800,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginBottom: '1rem',
              }}
            >
              <Compass size={14} />
              <span>THE PHILOSOPHY OF CALM</span>
            </div>

            <h2
              style={{
                fontSize: 'clamp(2.2rem, 3.8vw, 3.4rem)',
                fontWeight: 900,
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                textTransform: 'uppercase',
                marginBottom: '1.4rem',
              }}
            >
              HIDDEN IN <br />
              <span style={{ color: 'var(--color-terracotta)' }}>
                PLAIN SIGHT.
              </span>
            </h2>

            <p
              style={{
                fontSize: '1.05rem',
                color: 'var(--color-sand)',
                lineHeight: 1.7,
                marginBottom: '2.5rem',
              }}
            >
              This capsule is not about shouting for attention. It is designed for those
              who value understated dominance—grounded in earthen terracotta hues,
              textured powder coatings that warm to the touch, and aerospace tolerances
              that guarantee silence under stress.
            </p>

            {/* 4 Architectural Feature Callouts */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1.5rem',
              }}
            >
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '1.2rem',
                  borderRadius: 'var(--radius-xs)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                  <Layers size={18} style={{ color: 'var(--color-terracotta)' }} />
                  <h4 style={{ fontSize: '0.9rem', color: '#FFFFFF', textTransform: 'uppercase' }}>
                    Dual Cryo-Barrier
                  </h4>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                  Traps internal thermal kinetic energy without sweating on hot desert countertops.
                </p>
              </div>

              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '1.2rem',
                  borderRadius: 'var(--radius-xs)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                  <Droplets size={18} style={{ color: 'var(--color-terracotta)' }} />
                  <h4 style={{ fontSize: '0.9rem', color: '#FFFFFF', textTransform: 'uppercase' }}>
                    100% Anti-Spill Seal
                  </h4>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                  Zero droplet leakage, even when tossed inside heavy duffels or off-road gear cases.
                </p>
              </div>

              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '1.2rem',
                  borderRadius: 'var(--radius-xs)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                  <Shield size={18} style={{ color: 'var(--color-terracotta)' }} />
                  <h4 style={{ fontSize: '0.9rem', color: '#FFFFFF', textTransform: 'uppercase' }}>
                    90% Recycled Metal
                  </h4>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                  Sustainable circular metallurgy meeting strict certified FDA and EU safety benchmarks.
                </p>
              </div>

              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '1.2rem',
                  borderRadius: 'var(--radius-xs)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                  <Compass size={18} style={{ color: 'var(--color-terracotta)' }} />
                  <h4 style={{ fontSize: '0.9rem', color: '#FFFFFF', textTransform: 'uppercase' }}>
                    Ergonomic Balance
                  </h4>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                  Weighted counter-balance makes 64oz feel lightweight and natural in a single stride.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

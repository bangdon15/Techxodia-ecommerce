import React from 'react';
import { Camera } from 'lucide-react';

const LOOKBOOK_ITEMS = [
  {
    image: '/assets/hero_collab.jpg',
    tag: 'CAMPAIGN 01',
    title: 'THE CALM BEFORE THE ARENA',
    description: 'Devin Booker with the 64oz Horizon Jug in desert terracotta.',
  },
  {
    image: '/assets/editorial_craft_detail.jpg',
    tag: 'CRAFTSMANSHIP',
    title: 'TEXTURE IN HARMONY',
    description: 'Laser-etched emblem on baked ceramic powder-coat.',
  },
  {
    image: '/assets/product_lunch_vault.jpg',
    tag: 'FIELD ARTIFACT',
    title: 'COLD-ROLLED STEEL RIBS',
    description: '10 QT Heritage Vault engineered for lifetime ruggedness.',
  },
  {
    image: '/assets/product_bottle_28oz.jpg',
    tag: 'EVERYDAY COMMUTE',
    title: 'SILENCE IN TRANSIT',
    description: 'Slimline Wellspring Flask fits seamlessly into vehicle consoles.',
  },
];

export const LookbookSection: React.FC = () => {
  return (
    <section
      id="lookbook"
      style={{
        paddingTop: '6rem',
        paddingBottom: '6rem',
        backgroundColor: '#0C0D0F',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div className="container-luxury">
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            marginBottom: '3.5rem',
          }}
        >
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
              marginBottom: '0.8rem',
            }}
          >
            <Camera size={14} />
            <span>VISUAL CAMPAIGN // ARCHIVE LOOKBOOK</span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              marginBottom: '1rem',
            }}
          >
            CAPTURE THE HORIZON
          </h2>

          <p
            style={{
              fontSize: '1rem',
              color: 'var(--color-text-secondary)',
              maxWidth: '600px',
              lineHeight: 1.6,
            }}
          >
            A visual study in desert architecture, high-stress athletic focus, and tactile metallurgy.
          </p>
        </div>

        {/* Gallery Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {LOOKBOOK_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className="img-zoom-container"
              style={{
                position: 'relative',
                borderRadius: 'var(--radius-xs)',
                overflow: 'hidden',
                backgroundColor: '#16181D',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                minHeight: '360px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '1.8rem',
              }}
            >
              <img
                src={item.image}
                alt={item.title}
                className="img-zoom-target"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: 0.8,
                }}
              />

              {/* Gradient Overlay */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 40%, rgba(12,13,15,0.95) 100%)',
                }}
              />

              {/* Text content */}
              <div style={{ position: 'relative', zIndex: 2 }}>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.64rem',
                    fontWeight: 800,
                    letterSpacing: '0.18em',
                    color: '#FFA578',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: '0.3rem',
                  }}
                >
                  {item.tag}
                </span>

                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    textTransform: 'uppercase',
                    marginBottom: '0.3rem',
                  }}
                >
                  {item.title}
                </h3>

                <p style={{ fontSize: '0.8rem', color: 'var(--color-sand)', lineHeight: 1.5 }}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

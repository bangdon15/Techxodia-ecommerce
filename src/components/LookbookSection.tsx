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
        backgroundColor: '#F8F8FA',
        borderTop: '1px solid #E4E4E7',
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
              color: '#000000',
              fontFamily: 'var(--font-display)',
              fontSize: '0.74rem',
              fontWeight: 800,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '0.8rem',
            }}
          >
            <Camera size={14} color="#000000" />
            <span>VISUAL CAMPAIGN // ARCHIVE LOOKBOOK</span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              fontWeight: 900,
              color: '#000000',
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
              color: '#52525B',
              maxWidth: '600px',
              lineHeight: 1.6,
            }}
          >
            A visual study in desert architecture, high-stress athletic focus, and tactile metallurgy.
          </p>
        </div>

        {/* Gallery Grid */}
        <div
          className="lookbook-gallery-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            width: '100%',
          }}
        >
          {LOOKBOOK_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className="img-zoom-container lookbook-card-item"
              style={{
                position: 'relative',
                borderRadius: 'var(--radius-xs)',
                overflow: 'hidden',
                backgroundColor: '#000000',
                border: '1px solid #E4E4E7',
                minHeight: '380px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '1.8rem',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.06)',
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
                  opacity: 0.88,
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
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.92) 100%)',
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
                    color: '#000000',
                    backgroundColor: '#FFFFFF',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '2px',
                    textTransform: 'uppercase',
                    display: 'inline-block',
                    marginBottom: '0.5rem',
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

                <p style={{ fontSize: '0.82rem', color: '#E4E4E7', lineHeight: 1.5 }}>
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

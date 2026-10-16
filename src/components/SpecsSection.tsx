import React from 'react';
import { Shield, Award, Sparkles, CheckCircle } from 'lucide-react';

const SPEC_ROWS = [
  {
    feature: 'Thermal Insulation Core',
    detail: 'Double-wall vacuum barrier with internal copper reflective foil',
    rating: '36 Hours Cold / 14 Hours Hot',
  },
  {
    feature: 'Alloy Composition',
    detail: '18/8 Pro-Grade Austenitic 304 Stainless Steel (90% recycled)',
    rating: 'Heavy-Duty 1.0mm Wall Gauge',
  },
  {
    feature: 'Exterior Coating',
    detail: 'Electrostatic-bonded ceramic powder coat (baked at 280°C)',
    rating: 'Chip, Scratch & Sweat Resistant',
  },
  {
    feature: 'Cap & Valve Sealing',
    detail: 'Food-grade platinum-cured silicone gasket system',
    rating: '100% Guaranteed Zero Leakage',
  },
  {
    feature: 'Hardware & Pivot Points',
    detail: 'Cast titanium-steel hinge pins on lunchbox and jug handles',
    rating: 'Tested to 50,000 Open/Close Cycles',
  },
  {
    feature: 'Safety & Eco Benchmark',
    detail: 'BPA, BPS, Phthalate and lead-free compliant',
    rating: 'FDA & LFGB Certified Food Safe',
  },
];

export const SpecsSection: React.FC = () => {
  return (
    <section
      id="specifications"
      style={{
        paddingTop: '6rem',
        paddingBottom: '6rem',
        backgroundColor: '#111215',
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
            <Shield size={14} />
            <span>AEROSPACE TOLERANCES</span>
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
            TECHNICAL ARCHITECTURE
          </h2>

          <p
            style={{
              fontSize: '1rem',
              color: 'var(--color-text-secondary)',
              maxWidth: '640px',
              lineHeight: 1.6,
            }}
          >
            Every Techxodia silhouette undergoes extreme temperature cycling, drop-test impacts,
            and hermetic vacuum seal validation before leaving the facility.
          </p>
        </div>

        {/* Specs Table */}
        <div
          style={{
            maxWidth: '920px',
            margin: '0 auto',
            backgroundColor: '#16181D',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 'var(--radius-xs)',
            overflow: 'hidden',
          }}
        >
          <div
            className="specs-header-bar"
            style={{
              padding: '1.2rem 1.8rem',
              backgroundColor: '#1B1E24',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.6rem',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '0.78rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#FFA578',
              }}
            >
              SERIES 01 // METALLURGY & SPECIFICATION MATRIX
            </span>

            <span
              style={{
                fontSize: '0.72rem',
                color: 'var(--color-text-muted)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <Award size={13} color="#FFA578" />
              ISO 9001 Certified Foundry
            </span>
          </div>

          <div>
            {SPEC_ROWS.map((row, index) => (
              <div
                key={index}
                className="spec-row-item"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '1rem',
                  padding: '1.2rem 1.8rem',
                  borderBottom:
                    index < SPEC_ROWS.length - 1
                      ? '1px solid rgba(255, 255, 255, 0.05)'
                      : 'none',
                  backgroundColor: index % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.015)',
                }}
              >
                <div>
                  <h4
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.95rem',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      marginBottom: '0.2rem',
                    }}
                  >
                    {row.feature}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                    {row.detail}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={15} color="#10B981" />
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: 'var(--color-sand)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {row.rating}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

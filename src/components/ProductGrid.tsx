import React, { useState } from 'react';
import { Product, ProductColor, CurrencyCode } from '../types';
import { ProductCard } from './ProductCard';
import { RefreshCw, Database } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  currency: CurrencyCode;
  onAddToCart: (product: Product, color: ProductColor) => void;
  onQuickView: (product: Product) => void;
  onRefreshProducts: () => void;
  isLoading: boolean;
  supabaseSource: 'supabase' | 'fallback';
}

const CATEGORIES = ['All Objects', 'Hydration Vessels', 'Field Gear', 'Bar & Social'] as const;

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  currency,
  onAddToCart,
  onQuickView,
  onRefreshProducts,
  isLoading,
  supabaseSource,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All Objects');

  const filteredProducts = activeCategory === 'All Objects'
    ? products
    : products.filter((p) => p.category === activeCategory);

  return (
    <section
      id="collection"
      style={{
        paddingTop: '6rem',
        paddingBottom: '6rem',
        backgroundColor: '#0C0D0F',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div className="container-luxury">
        {/* Section Header */}
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
              gap: '0.45rem',
              color: 'var(--color-terracotta)',
              fontFamily: 'var(--font-display)',
              fontSize: '0.74rem',
              fontWeight: 800,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '0.8rem',
            }}
          >
            <span>THE COMPLETE CAPSULE</span>
            <span>•</span>
            <span>NUMBERED ALLOCATION</span>
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
            TECHXODIA × SIGNATURE COLLECTION
          </h2>

          <p
            style={{
              fontSize: '1rem',
              color: 'var(--color-text-secondary)',
              maxWidth: '620px',
              lineHeight: 1.6,
            }}
          >
            Inspired by quiet confidence and architectural discipline. Every item is
            vacuum-sealed, laser-inscribed, and finished in bespoke desert earth tones.
          </p>

          {/* Database Live Source Pill & Refresh */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              marginTop: '1.4rem',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.72rem',
                color: 'var(--color-text-muted)',
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.06em',
              }}
            >
              <Database size={13} style={{ color: supabaseSource === 'supabase' ? '#10B981' : '#F59E0B' }} />
              Source: {supabaseSource === 'supabase' ? 'Supabase Database (Live Products Table)' : 'Local High-Fidelity Catalog (Ready for Supabase)'}
            </span>

            <button
              onClick={onRefreshProducts}
              disabled={isLoading}
              title="Refresh Products from Database"
              style={{
                background: 'none',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: 'var(--color-text-secondary)',
                borderRadius: 'var(--radius-pill)',
                padding: '0.25rem 0.6rem',
                fontSize: '0.68rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all 0.2s',
              }}
            >
              <RefreshCw size={11} className={isLoading ? 'spin-icon' : ''} />
              <span>SYNC</span>
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '0.6rem',
            marginBottom: '3.5rem',
          }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  background: isActive ? 'var(--color-terracotta)' : 'rgba(255, 255, 255, 0.04)',
                  color: isActive ? '#FFFFFF' : 'var(--color-text-secondary)',
                  border: isActive
                    ? '1px solid var(--color-terracotta)'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '0.6rem 1.4rem',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  borderRadius: 'var(--radius-xs)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.8rem',
          }}
        >
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id || product.slug}
              product={product}
              currency={currency}
              onAddToCart={onAddToCart}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      </div>

      <style>{`
        .spin-icon {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};

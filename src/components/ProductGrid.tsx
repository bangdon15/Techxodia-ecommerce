import React, { useState } from 'react';
import { Product, ProductColor, CurrencyCode } from '../types';
import { ProductCard } from './ProductCard';
import { RefreshCw, Database } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  currency: CurrencyCode;
  onAddToCart: (product: Product, color: ProductColor) => void;
  onQuickView: (product: Product, selectedColor?: ProductColor) => void;
  onRefreshProducts?: () => void;
  isLoading?: boolean;
  supabaseSource?: 'supabase' | 'fallback';
}

const CATEGORIES = ['All Objects', 'Hydration Vessels', 'Field Gear', 'Bar & Social'] as const;

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  currency,
  onAddToCart,
  onQuickView,
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
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E4E4E7',
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
              color: '#000000',
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
              color: '#000000',
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
              color: '#52525B',
              maxWidth: '620px',
              lineHeight: 1.6,
            }}
          >
            Inspired by quiet confidence and architectural discipline. Every item is
            vacuum-sealed, laser-inscribed, and finished in bespoke monochrome & desert earth tones.
          </p>
        </div>

        {/* Category Tabs */}
        <div
          className="product-category-tabs"
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
                className="category-tab-btn"
                style={{
                  background: isActive ? '#000000' : '#F4F4F5',
                  color: isActive ? '#FFFFFF' : '#18181B',
                  border: isActive
                    ? '1px solid #000000'
                    : '1px solid #E4E4E7',
                  padding: '0.65rem 1.4rem',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  borderRadius: 'var(--radius-xs)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Product Grid - Wide and Generous */}
        <div
          className="product-grid-container"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(285px, 1fr))',
            gap: '1.6rem',
            width: '100%',
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

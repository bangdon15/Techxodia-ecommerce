import React, { useState } from 'react';
import { Star, ShoppingBag, Eye } from 'lucide-react';
import { Product, ProductColor, CurrencyCode } from '../types';
import { formatPrice } from '../lib/currency';

interface ProductCardProps {
  product: Product;
  currency: CurrencyCode;
  onAddToCart: (product: Product, color: ProductColor) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  onAddToCart,
  onQuickView,
}) => {
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product.colors[0] || { name: 'Standard', hex: '#C86237' }
  );
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: '#14161A',
        borderRadius: 'var(--radius-xs)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: isHovered
          ? '0 18px 36px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(200, 98, 55, 0.3)'
          : 'none',
      }}
    >
      {/* Product Image Area */}
      <div
        style={{
          position: 'relative',
          paddingTop: '100%', // 1:1 Aspect Ratio
          backgroundColor: '#1E2127',
          overflow: 'hidden',
          cursor: 'pointer',
        }}
        onClick={() => onQuickView(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: isHovered ? 'scale(1.06)' : 'scale(1)',
          }}
          loading="lazy"
        />

        {/* Badge */}
        {product.badge && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              zIndex: 2,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.62rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '0.35rem 0.65rem',
                backgroundColor: 'rgba(12, 13, 15, 0.9)',
                color: '#FFA578',
                border: '1px solid rgba(200, 98, 55, 0.4)',
                borderRadius: 'var(--radius-xs)',
                backdropFilter: 'blur(6px)',
              }}
            >
              {product.badge}
            </span>
          </div>
        )}

        {/* Quick View Button overlay on hover */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            zIndex: 2,
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateY(0)' : 'translateY(8px)',
            transition: 'all 0.25s ease',
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'rgba(12, 13, 15, 0.92)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '0.45rem 0.8rem',
              fontSize: '0.68rem',
              fontWeight: 700,
              fontFamily: 'var(--font-display)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              borderRadius: 'var(--radius-xs)',
              backdropFilter: 'blur(6px)',
            }}
          >
            <Eye size={13} />
            <span>QUICK VIEW</span>
          </button>
        </div>
      </div>

      {/* Product Information Body */}
      <div
        style={{
          padding: '1.4rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
        }}
      >
        <div>
          {/* Rating and Capacity row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.6rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Star size={13} fill="#FFA578" color="#FFA578" />
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-display)',
                }}
              >
                {product.rating}
              </span>
              <span
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--color-text-muted)',
                }}
              >
                ({product.reviews_count})
              </span>
            </div>

            <span
              style={{
                fontSize: '0.68rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                color: 'var(--color-sand)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {product.capacity}
            </span>
          </div>

          {/* Product Name */}
          <h3
            onClick={() => onQuickView(product)}
            style={{
              fontSize: '1.05rem',
              fontWeight: 800,
              color: '#FFFFFF',
              lineHeight: 1.3,
              marginBottom: '0.4rem',
              letterSpacing: '-0.01em',
              cursor: 'pointer',
              transition: 'color 0.2s',
            }}
          >
            {product.name}
          </h3>

          {/* Subtitle / Edition */}
          <p
            style={{
              fontSize: '0.75rem',
              color: 'var(--color-text-secondary)',
              letterSpacing: '0.04em',
              marginBottom: '1rem',
            }}
          >
            {product.subtitle}
          </p>

          {/* Color Selection Swatches */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              marginBottom: '1.4rem',
            }}
          >
            {product.colors.map((color, i) => {
              const isSelected = selectedColor.name === color.name;
              return (
                <button
                  key={i}
                  onClick={() => setSelectedColor(color)}
                  title={color.name}
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: color.hex,
                    border: isSelected
                      ? '2px solid #FFFFFF'
                      : '1px solid rgba(255, 255, 255, 0.2)',
                    cursor: 'pointer',
                    outline: isSelected ? '1px solid var(--color-terracotta)' : 'none',
                    outlineOffset: '2px',
                    transition: 'all 0.15s ease',
                  }}
                  aria-label={`Select color ${color.name}`}
                />
              );
            })}
            <span
              style={{
                fontSize: '0.7rem',
                color: 'var(--color-text-muted)',
                marginLeft: '0.3rem',
                fontFamily: 'var(--font-display)',
              }}
            >
              {selectedColor.name}
            </span>
          </div>
        </div>

        {/* Price and Add to Bag Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#FFFFFF',
                letterSpacing: '0.02em',
              }}
            >
              {formatPrice(product.price, currency)}
            </span>
            {product.original_price && (
              <span
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--color-text-muted)',
                  textDecoration: 'line-through',
                }}
              >
                {formatPrice(product.original_price, currency)}
              </span>
            )}
          </div>

          <button
            onClick={() => onAddToCart(product, selectedColor)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: 'var(--color-terracotta)',
              color: '#FFFFFF',
              border: 'none',
              padding: '0.65rem 1rem',
              fontSize: '0.75rem',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              borderRadius: 'var(--radius-xs)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            className="add-to-cart-btn"
          >
            <ShoppingBag size={14} />
            <span>ADD</span>
          </button>
        </div>
      </div>
    </div>
  );
};

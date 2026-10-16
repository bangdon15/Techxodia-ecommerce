import React, { useState } from 'react';
import { Star, ShoppingBag, Eye } from 'lucide-react';
import { Product, ProductColor, CurrencyCode } from '../types';
import { formatPrice } from '../lib/currency';

interface ProductCardProps {
  product: Product;
  currency: CurrencyCode;
  onAddToCart: (product: Product, color: ProductColor) => void;
  onQuickView: (product: Product, selectedColor?: ProductColor) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  onAddToCart,
  onQuickView,
}) => {
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product.colors[0] || { name: 'Polar White', hex: '#FFFFFF' }
  );
  const [isHovered, setIsHovered] = useState(false);
  const [imageKey, setImageKey] = useState(0);

  const handleColorSelect = (e: React.MouseEvent, color: ProductColor) => {
    e.stopPropagation();
    setSelectedColor(color);
    setImageKey((prev) => prev + 1);
  };

  const currentDisplayImage = selectedColor.image || product.image;

  // Smart fallback tone shift if a custom hex was added without a dedicated photo
  const getFilterStyle = (): React.CSSProperties => {
    if (selectedColor.image) return {};
    const hex = selectedColor.hex.toLowerCase();
    if (hex === '#1f2124' || hex === '#272a30' || hex === '#000000') {
      return { filter: 'brightness(0.55) contrast(1.2) grayscale(0.85)' };
    }
    if (hex === '#d8cebc' || hex === '#efece4' || hex === '#ffffff') {
      return { filter: 'sepia(0.25) brightness(1.25) contrast(0.95)' };
    }
    if (hex === '#334fb4' || hex === '#1e3a8a') {
      return { filter: 'hue-rotate(180deg) saturate(1.2)' };
    }
    return {};
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-xs)',
        border: '1px solid #E4E4E7',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
        boxShadow: isHovered
          ? '0 16px 36px rgba(0, 0, 0, 0.08), 0 0 0 1px #000000'
          : '0 2px 8px rgba(0, 0, 0, 0.02)',
      }}
      className="product-card-container"
    >
      {/* Product Image Area */}
      <div
        style={{
          position: 'relative',
          paddingTop: '100%', // 1:1 Aspect Ratio
          backgroundColor: '#F5F5F7',
          overflow: 'hidden',
          cursor: 'pointer',
        }}
        onClick={() => onQuickView(product, selectedColor)}
      >
        <img
          key={`${selectedColor.name}-${imageKey}`}
          src={currentDisplayImage}
          alt={`${product.name} - ${selectedColor.name}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease',
            transform: isHovered ? 'scale(1.06)' : 'scale(1)',
            animation: 'fadeIn 0.25s ease-out',
            ...getFilterStyle(),
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
                backgroundColor: '#000000',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-xs)',
              }}
            >
              {product.badge}
            </span>
          </div>
        )}

        {/* Quick View Button on Desktop Hover */}
        <div
          className="quick-view-btn-wrap"
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
              onQuickView(product, selectedColor);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.3)',
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
        className="product-card-body"
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
              <Star size={13} fill="#000000" color="#000000" />
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: '#000000',
                  fontFamily: 'var(--font-display)',
                }}
              >
                {product.rating}
              </span>
              <span
                style={{
                  fontSize: '0.72rem',
                  color: '#71717A',
                }}
              >
                ({product.reviews_count})
              </span>
            </div>

            <span
              style={{
                fontSize: '0.68rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                color: '#71717A',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {product.capacity}
            </span>
          </div>

          {/* Product Name */}
          <h3
            onClick={() => onQuickView(product, selectedColor)}
            style={{
              fontSize: '1.05rem',
              fontWeight: 800,
              color: '#000000',
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
              color: '#52525B',
              letterSpacing: '0.04em',
              marginBottom: '1rem',
            }}
          >
            {product.subtitle}
          </p>

          {/* Color Selection Swatches with real live state */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.5rem',
              marginBottom: '1.4rem',
            }}
          >
            {product.colors.map((color, i) => {
              const isSelected = selectedColor.name === color.name;
              return (
                <button
                  key={i}
                  onClick={(e) => handleColorSelect(e, color)}
                  title={color.name}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: color.hex,
                    border: isSelected
                      ? '2px solid #000000'
                      : '1px solid #D4D4D8',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 0 0 2px #000000' : 'none',
                    transition: 'all 0.18s ease',
                    position: 'relative',
                    padding: 0,
                  }}
                  aria-label={`Select color ${color.name}`}
                >
                  {isSelected && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: '#FFFFFF',
                      }}
                    />
                  )}
                </button>
              );
            })}
            <span
              style={{
                fontSize: '0.72rem',
                color: '#000000',
                marginLeft: '0.3rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
              }}
            >
              {selectedColor.name}
            </span>
          </div>
        </div>

        {/* Price and Add to Bag Row */}
        <div
          className="product-card-action-row"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid #E4E4E7',
            paddingTop: '1rem',
          }}
        >
          <div className="product-card-price-wrap" style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span
              className="product-card-price"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                fontWeight: 900,
                color: '#000000',
                letterSpacing: '0.02em',
              }}
            >
              {formatPrice(product.price, currency)}
            </span>
            {product.original_price && (
              <span
                style={{
                  fontSize: '0.85rem',
                  color: '#A1A1AA',
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
              backgroundColor: '#000000',
              color: '#FFFFFF',
              border: '1px solid #000000',
              padding: '0.65rem 1.15rem',
              fontSize: '0.75rem',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              borderRadius: 'var(--radius-xs)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              minHeight: '40px',
            }}
            className="add-to-cart-btn product-card-add-btn"
          >
            <ShoppingBag size={14} />
            <span>ADD</span>
          </button>
        </div>
      </div>
    </div>
  );
};

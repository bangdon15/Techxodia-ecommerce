import React, { useState } from 'react';
import { X, Star, ShoppingBag, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { Product, ProductColor, CurrencyCode } from '../types';
import { formatPrice } from '../lib/currency';
import confetti from 'canvas-confetti';

interface ProductDetailModalProps {
  product: Product | null;
  currency: CurrencyCode;
  onClose: () => void;
  onAddToCart: (product: Product, color: ProductColor, quantity: number, customEngraving?: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  currency,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const [activeImage, setActiveImage] = useState<string>(product.image);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product.colors[0] || { name: 'Standard', hex: '#C86237' }
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [engraving, setEngraving] = useState<string>('');
  const [showEngraveInput, setShowEngraveInput] = useState<boolean>(false);

  const handleAdd = () => {
    // Fire festive micro-confetti
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#C86237', '#FFA578', '#FFFFFF', '#D8CEBC']
      });
    } catch {
      // ignore
    }

    onAddToCart(product, selectedColor, quantity, engraving.trim() || undefined);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#14161A',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 'var(--radius-sm)',
          maxWidth: '920px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          position: 'relative',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 10,
            background: 'rgba(0, 0, 0, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#FFFFFF',
            cursor: 'pointer',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
          }}
          aria-label="Close Modal"
        >
          <X size={18} />
        </button>

        {/* Left Column: Gallery */}
        <div
          style={{
            padding: '2rem',
            backgroundColor: '#1A1D24',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              width: '100%',
              paddingTop: '100%',
              position: 'relative',
              borderRadius: 'var(--radius-xs)',
              overflow: 'hidden',
              backgroundColor: '#14161A',
              marginBottom: '1rem',
            }}
          >
            <img
              src={activeImage}
              alt={product.name}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>

          {/* Thumbnails */}
          {product.gallery && product.gallery.length > 1 && (
            <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto' }}>
              {product.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: 'var(--radius-xs)',
                    overflow: 'hidden',
                    border: activeImage === img ? '2px solid var(--color-terracotta)' : '1px solid rgba(255, 255, 255, 0.1)',
                    padding: 0,
                    cursor: 'pointer',
                    background: 'none',
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={img}
                    alt="thumbnail"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details & Purchasing */}
        <div style={{ padding: '2.2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            {/* Badge & Edition */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
              {product.badge && (
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#FFA578',
                    backgroundColor: 'rgba(200, 98, 55, 0.15)',
                    padding: '0.25rem 0.6rem',
                    border: '1px solid rgba(200, 98, 55, 0.3)',
                    borderRadius: 'var(--radius-xs)',
                  }}
                >
                  {product.badge}
                </span>
              )}
              <span style={{ fontSize: '0.72rem', color: 'var(--color-sand)', letterSpacing: '0.08em' }}>
                {product.capacity}
              </span>
            </div>

            <h2
              style={{
                fontSize: '1.6rem',
                fontWeight: 900,
                color: '#FFFFFF',
                lineHeight: 1.2,
                marginBottom: '0.3rem',
                textTransform: 'uppercase',
              }}
            >
              {product.name}
            </h2>

            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1.2rem' }}>
              {product.subtitle}
            </p>

            {/* Price & Rating */}
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '1rem',
                marginBottom: '1.4rem',
                paddingBottom: '1.2rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.8rem',
                  fontWeight: 900,
                  color: '#FFFFFF',
                }}
              >
                {formatPrice(product.price, currency)}
              </span>

              {product.original_price && (
                <span style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>
                  {formatPrice(product.original_price, currency)}
                </span>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginLeft: 'auto' }}>
                <Star size={14} fill="#FFA578" color="#FFA578" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF' }}>{product.rating}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>({product.reviews_count} reviews)</span>
              </div>
            </div>

            {/* Description */}
            <p style={{ fontSize: '0.9rem', color: 'var(--color-sand)', lineHeight: 1.6, marginBottom: '1.4rem' }}>
              {product.description}
            </p>

            {/* Color Swatches */}
            <div style={{ marginBottom: '1.5rem' }}>
              <span
                style={{
                  display: 'block',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-secondary)',
                  marginBottom: '0.6rem',
                }}
              >
                Selected Hue: <strong style={{ color: '#FFFFFF' }}>{selectedColor.name}</strong>
              </span>

              <div style={{ display: 'flex', gap: '0.6rem' }}>
                {product.colors.map((c, idx) => {
                  const isSel = selectedColor.name === c.name;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(c)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        backgroundColor: isSel ? 'rgba(200, 98, 55, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                        border: isSel ? '1px solid var(--color-terracotta)' : '1px solid rgba(255, 255, 255, 0.1)',
                        padding: '0.4rem 0.75rem',
                        borderRadius: 'var(--radius-xs)',
                        cursor: 'pointer',
                        color: isSel ? '#FFFFFF' : 'var(--color-text-secondary)',
                        fontSize: '0.75rem',
                        fontFamily: 'var(--font-display)',
                        fontWeight: 600,
                      }}
                    >
                      <span
                        style={{
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          backgroundColor: c.hex,
                          display: 'inline-block',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                        }}
                      />
                      <span>{c.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Laser Engraving Option Toggle */}
            <div style={{ marginBottom: '1.5rem' }}>
              <button
                type="button"
                onClick={() => setShowEngraveInput(!showEngraveInput)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-terracotta-light)',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: 0,
                  marginBottom: showEngraveInput ? '0.6rem' : 0,
                }}
              >
                <Sparkles size={13} />
                <span>{showEngraveInput ? '− Remove Custom Laser Engraving' : '+ Add Custom Laser Engraving (Complimentary)'}</span>
              </button>

              {showEngraveInput && (
                <div style={{ marginTop: '0.5rem' }}>
                  <input
                    type="text"
                    maxLength={14}
                    placeholder="E.g. INITIALS // TX-01"
                    value={engraving}
                    onChange={(e) => setEngraving(e.target.value.toUpperCase())}
                    style={{
                      width: '100%',
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(200, 98, 55, 0.4)',
                      padding: '0.65rem 0.85rem',
                      color: '#FFFFFF',
                      fontSize: '0.85rem',
                      fontFamily: 'var(--font-display)',
                      letterSpacing: '0.14em',
                      outline: 'none',
                      borderRadius: 'var(--radius-xs)',
                    }}
                  />
                  <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '0.3rem' }}>
                    Precision laser-etched on stainless steel reverse side. Max 14 characters.
                  </span>
                </div>
              )}
            </div>

            {/* Specifications List */}
            {product.specs && product.specs.length > 0 && (
              <div
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.25)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '1rem',
                  marginBottom: '1.8rem',
                }}
              >
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--color-sand)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Technical Specifications
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {product.specs.map((s, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>{s.label}</span>
                      <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Purchasing Controls */}
          <div>
            <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', marginBottom: '0.8rem' }}>
              {/* Quantity */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: 'var(--radius-xs)',
                  overflow: 'hidden',
                }}
              >
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#FFFFFF',
                    width: '38px',
                    height: '46px',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                  }}
                >
                  −
                </button>
                <span
                  style={{
                    width: '32px',
                    textAlign: 'center',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    fontSize: '0.95rem',
                  }}
                >
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#FFFFFF',
                    width: '38px',
                    height: '46px',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                  }}
                >
                  +
                </button>
              </div>

              {/* Add to Bag Button */}
              <button
                onClick={handleAdd}
                className="btn-primary"
                style={{ flex: 1, padding: '0.9rem 1.4rem' }}
              >
                <ShoppingBag size={16} />
                <span>ADD TO BAG • {formatPrice(product.price * quantity, currency)}</span>
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <Check size={12} color="#10B981" />
                Allocated Stock Verified ({product.stock} units)
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <ShieldCheck size={12} color="#FFA578" />
                Lifetime Performance Guarantee
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

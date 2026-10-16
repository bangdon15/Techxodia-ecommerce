import React, { useState, useEffect } from 'react';
import { X, Star, ShoppingBag, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { Product, ProductColor, CurrencyCode } from '../types';
import { formatPrice } from '../lib/currency';
import confetti from 'canvas-confetti';

interface ProductDetailModalProps {
  product: Product | null;
  initialColor?: ProductColor | null;
  currency: CurrencyCode;
  onClose: () => void;
  onAddToCart: (product: Product, color: ProductColor, quantity: number, customEngraving?: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  initialColor,
  currency,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    initialColor || product.colors[0] || { name: 'Standard', hex: '#C86237' }
  );
  const [activeImage, setActiveImage] = useState<string>(
    initialColor?.image || product.colors[0]?.image || product.image
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [engraving, setEngraving] = useState<string>('');
  const [showEngraveInput, setShowEngraveInput] = useState<boolean>(false);

  useEffect(() => {
    if (product) {
      const color = initialColor || product.colors[0] || { name: 'Standard', hex: '#C86237' };
      setSelectedColor(color);
      setActiveImage(color.image || product.image);
      setQuantity(1);
      setEngraving('');
    }
  }, [product, initialColor]);

  const handleColorChange = (c: ProductColor) => {
    setSelectedColor(c);
    if (c.image) {
      setActiveImage(c.image);
    }
  };

  const handleAdd = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#000000', '#52525B', '#A1A1AA', '#FFFFFF']
      });
    } catch {
      // ignore
    }

    onAddToCart(product, selectedColor, quantity, engraving.trim() || undefined);
    onClose();
  };

  // Smart fallback tone shift if a custom hex was added without a dedicated photo
  const getFilterStyle = (): React.CSSProperties => {
    if (selectedColor.image && activeImage === selectedColor.image) return {};
    const hex = selectedColor.hex.toLowerCase();
    if (hex === '#1f2124' || hex === '#272a30' || hex === '#000000') {
      return { filter: 'brightness(0.55) contrast(1.2) grayscale(0.85)' };
    }
    if (hex === '#d8cebc' || hex === '#efece4' || hex === '#ffffff') {
      return { filter: 'sepia(0.25) brightness(1.25) contrast(0.95)' };
    }
    return {};
  };

  return (
    <div
      onClick={onClose}
      className="product-modal-backdrop"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(12px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E4E4E7',
          borderRadius: 'var(--radius-sm)',
          maxWidth: '940px',
          width: '100%',
          maxHeight: '94vh',
          overflowY: 'auto',
          position: 'relative',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          WebkitOverflowScrolling: 'touch',
        }}
        className="product-modal-dialog"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 10,
            background: '#FFFFFF',
            border: '1px solid #E4E4E7',
            color: '#000000',
            cursor: 'pointer',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s',
          }}
          aria-label="Close Modal"
        >
          <X size={20} />
        </button>

        {/* Left Column: Gallery */}
        <div
          style={{
            padding: '1.8rem',
            backgroundColor: '#F8F8FA',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRight: '1px solid #E4E4E7',
          }}
        >
          <div
            style={{
              width: '100%',
              paddingTop: '100%',
              position: 'relative',
              borderRadius: 'var(--radius-xs)',
              overflow: 'hidden',
              backgroundColor: '#F4F4F5',
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
                transition: 'opacity 0.25s ease',
                ...getFilterStyle(),
              }}
            />
          </div>

          {/* Thumbnails */}
          {product.gallery && product.gallery.length > 1 && (
            <div
              style={{
                display: 'flex',
                gap: '0.6rem',
                overflowX: 'auto',
                paddingBottom: '0.4rem',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {product.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: 'var(--radius-xs)',
                    overflow: 'hidden',
                    border: activeImage === img ? '2px solid #000000' : '1px solid #E4E4E7',
                    padding: 0,
                    cursor: 'pointer',
                    background: '#FFFFFF',
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
        <div
          style={{
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            {/* Badge & Edition */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
              {product.badge && (
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#FFFFFF',
                    backgroundColor: '#000000',
                    padding: '0.25rem 0.6rem',
                    borderRadius: 'var(--radius-xs)',
                  }}
                >
                  {product.badge}
                </span>
              )}
              <span style={{ fontSize: '0.74rem', color: '#52525B', letterSpacing: '0.08em', fontWeight: 700 }}>
                {product.capacity}
              </span>
            </div>

            <h2
              style={{
                fontSize: 'clamp(1.3rem, 2.5vw, 1.7rem)',
                fontWeight: 900,
                color: '#000000',
                lineHeight: 1.2,
                marginBottom: '0.3rem',
                textTransform: 'uppercase',
              }}
            >
              {product.name}
            </h2>

            <p style={{ fontSize: '0.85rem', color: '#52525B', marginBottom: '1.2rem' }}>
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
                borderBottom: '1px solid #E4E4E7',
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.8rem',
                  fontWeight: 900,
                  color: '#000000',
                }}
              >
                {formatPrice(product.price, currency)}
              </span>

              {product.original_price && (
                <span style={{ fontSize: '1.1rem', color: '#71717A', textDecoration: 'line-through' }}>
                  {formatPrice(product.original_price, currency)}
                </span>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginLeft: 'auto' }}>
                <Star size={14} fill="#000000" color="#000000" />
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#000000' }}>{product.rating}</span>
                <span style={{ fontSize: '0.75rem', color: '#71717A' }}>({product.reviews_count} reviews)</span>
              </div>
            </div>

            {/* Description */}
            <p style={{ fontSize: '0.88rem', color: '#52525B', lineHeight: 1.6, marginBottom: '1.4rem' }}>
              {product.description}
            </p>

            {/* Color Swatches with Active Color Switch */}
            <div style={{ marginBottom: '1.5rem' }}>
              <span
                style={{
                  display: 'block',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#000000',
                  marginBottom: '0.7rem',
                }}
              >
                Select Colorway: <strong style={{ color: '#000000' }}>{selectedColor.name}</strong>
              </span>

              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                {product.colors.map((c, idx) => {
                  const isSel = selectedColor.name === c.name;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleColorChange(c)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        backgroundColor: isSel ? '#000000' : '#FFFFFF',
                        border: isSel ? '1.5px solid #000000' : '1px solid #D4D4D8',
                        padding: '0.5rem 0.85rem',
                        borderRadius: 'var(--radius-xs)',
                        cursor: 'pointer',
                        color: isSel ? '#FFFFFF' : '#000000',
                        fontSize: '0.78rem',
                        fontFamily: 'var(--font-display)',
                        fontWeight: 800,
                        transition: 'all 0.15s ease',
                        minHeight: '40px',
                      }}
                    >
                      <span
                        style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          backgroundColor: c.hex,
                          display: 'inline-block',
                          border: isSel ? '2px solid #FFFFFF' : '1px solid rgba(0, 0, 0, 0.2)',
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
                  color: '#000000',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.75rem',
                  fontWeight: 800,
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
                <Sparkles size={13} color="#000000" />
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
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #000000',
                      padding: '0.75rem 0.85rem',
                      color: '#000000',
                      fontSize: '0.85rem',
                      fontFamily: 'var(--font-display)',
                      letterSpacing: '0.14em',
                      outline: 'none',
                      borderRadius: 'var(--radius-xs)',
                    }}
                  />
                  <span style={{ fontSize: '0.68rem', color: '#71717A', display: 'block', marginTop: '0.3rem' }}>
                    Precision laser-etched on stainless steel reverse side. Max 14 characters.
                  </span>
                </div>
              )}
            </div>

            {/* Specifications List */}
            {product.specs && product.specs.length > 0 && (
              <div
                style={{
                  backgroundColor: '#F8F8FA',
                  border: '1px solid #E4E4E7',
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
                    color: '#000000',
                    marginBottom: '0.5rem',
                  }}
                >
                  Technical Specifications
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {product.specs.map((s, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                      <span style={{ color: '#71717A' }}>{s.label}</span>
                      <span style={{ color: '#000000', fontWeight: 700 }}>{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Purchasing Controls */}
          <div>
            <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
              {/* Quantity */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#F4F4F5',
                  border: '1px solid #E4E4E7',
                  borderRadius: 'var(--radius-xs)',
                  overflow: 'hidden',
                  height: '48px',
                }}
              >
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#000000',
                    width: '42px',
                    height: '100%',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                  }}
                  aria-label="Decrease Quantity"
                >
                  −
                </button>
                <span
                  style={{
                    width: '32px',
                    textAlign: 'center',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    color: '#000000',
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
                    color: '#000000',
                    width: '42px',
                    height: '100%',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                  }}
                  aria-label="Increase Quantity"
                >
                  +
                </button>
              </div>

              {/* Add to Bag Button */}
              <button
                onClick={handleAdd}
                className="btn-primary"
                style={{ flex: '1 1 200px', height: '48px', fontSize: '0.82rem' }}
              >
                <ShoppingBag size={16} />
                <span>ADD TO BAG • {formatPrice(product.price * quantity, currency)}</span>
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.72rem', color: '#71717A', flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <Check size={12} color="#000000" />
                Allocated Stock Verified ({product.stock} units)
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <ShieldCheck size={12} color="#000000" />
                Lifetime Performance Guarantee
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { CartItem, CurrencyCode } from '../types';
import { formatPrice } from '../lib/currency';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  currency: CurrencyCode;
  onCheckout: () => void;
}

const FREE_SHIPPING_THRESHOLD_USD = 75;

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  currency,
  onCheckout,
}) => {
  if (!isOpen) return null;

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  const subtotalUsd = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const discountRate = promoApplied ? 0.1 : 0;
  const discountUsd = subtotalUsd * discountRate;
  const isFreeShipping = subtotalUsd >= FREE_SHIPPING_THRESHOLD_USD || subtotalUsd === 0;
  const shippingUsd = isFreeShipping ? 0 : 12;
  const totalUsd = Math.max(0, subtotalUsd - discountUsd + shippingUsd);

  const progressPercent = Math.min(100, (subtotalUsd / FREE_SHIPPING_THRESHOLD_USD) * 100);
  const diffToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD_USD - subtotalUsd);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'TECH10') {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid code. Try "TECH10" for 10% off.');
    }
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
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 90,
        display: 'flex',
        justifyContent: 'flex-end',
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          backgroundColor: '#FFFFFF',
          borderLeft: '1px solid #E4E4E7',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.25)',
          animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.4rem 1.6rem',
            borderBottom: '1px solid #E4E4E7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: '1.1rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#000000',
              }}
            >
              YOUR SHOPPING BAG
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                color: '#52525B',
                fontWeight: 800,
              }}
            >
              ({items.reduce((acc, i) => acc + i.quantity, 0)})
            </span>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#000000',
              cursor: 'pointer',
              padding: '0.4rem',
              display: 'flex',
              alignItems: 'center',
            }}
            aria-label="Close Cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div
          style={{
            padding: '1rem 1.6rem',
            backgroundColor: '#F4F4F5',
            borderBottom: '1px solid #E4E4E7',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.74rem',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#000000',
              marginBottom: '0.4rem',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Truck size={14} color="#000000" />
              {isFreeShipping && subtotalUsd > 0
                ? 'FREE EXPRESS SHIPPING UNLOCKED!'
                : `ADD ${formatPrice(diffToFreeShipping, currency)} FOR FREE SHIPPING`}
            </span>
            <span style={{ color: '#000000', fontWeight: 800 }}>
              {Math.round(progressPercent)}%
            </span>
          </div>

          <div
            style={{
              width: '100%',
              height: '5px',
              backgroundColor: '#E4E4E7',
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progressPercent}%`,
                backgroundColor: '#000000',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>

        {/* Items List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.2rem 1.6rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.2rem',
          }}
        >
          {items.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center',
                color: '#71717A',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#000000',
                  marginBottom: '0.5rem',
                }}
              >
                YOUR BAG IS EMPTY
              </span>
              <p style={{ fontSize: '0.85rem', maxWidth: '240px', lineHeight: 1.5, marginBottom: '1.5rem', color: '#52525B' }}>
                Explore the limited Techxodia Series 01 drop before the numbered allocation closes.
              </p>
              <button
                onClick={onClose}
                className="btn-primary"
                style={{ fontSize: '0.74rem', padding: '0.75rem 1.4rem' }}
              >
                EXPLORE COLLECTION
              </button>
            </div>
          ) : (
            items.map((item, index) => (
              <div
                key={`${item.product.id}-${item.selectedColor.name}-${item.customEngraving || ''}-${index}`}
                style={{
                  display: 'flex',
                  gap: '1rem',
                  paddingBottom: '1.2rem',
                  borderBottom: '1px solid #E4E4E7',
                }}
              >
                {/* Thumbnail */}
                <div
                  style={{
                    width: '84px',
                    height: '84px',
                    borderRadius: 'var(--radius-xs)',
                    backgroundColor: '#F4F4F5',
                    overflow: 'hidden',
                    flexShrink: 0,
                    border: '1px solid #E4E4E7',
                  }}
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Info */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4
                      style={{
                        fontSize: '0.88rem',
                        fontWeight: 800,
                        color: '#000000',
                        lineHeight: 1.3,
                        marginBottom: '0.2rem',
                      }}
                    >
                      {item.product.name}
                    </h4>

                    {/* Color Tag */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                      <span
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          backgroundColor: item.selectedColor.hex,
                          display: 'inline-block',
                          border: '1px solid rgba(0,0,0,0.15)',
                        }}
                      />
                      <span style={{ fontSize: '0.72rem', color: '#52525B' }}>
                        {item.selectedColor.name} • {item.product.capacity}
                      </span>
                    </div>

                    {/* Custom Engraving */}
                    {item.customEngraving && (
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          fontSize: '0.66rem',
                          color: '#000000',
                          backgroundColor: '#F4F4F5',
                          padding: '0.15rem 0.4rem',
                          borderRadius: '2px',
                          border: '1px solid #E4E4E7',
                          marginBottom: '0.3rem',
                          fontWeight: 700,
                        }}
                      >
                        <Sparkles size={10} color="#000000" />
                        <span>ENGRAVED: "{item.customEngraving}"</span>
                      </div>
                    )}
                  </div>

                  {/* Quantity and Price */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: '#F4F4F5',
                        border: '1px solid #E4E4E7',
                        borderRadius: 'var(--radius-xs)',
                      }}
                    >
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#000000',
                          width: '24px',
                          height: '28px',
                          cursor: 'pointer',
                          fontWeight: 700,
                        }}
                      >
                        −
                      </button>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, padding: '0 4px', color: '#000000' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#000000',
                          width: '24px',
                          height: '28px',
                          cursor: 'pointer',
                          fontWeight: 700,
                        }}
                      >
                        +
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontWeight: 800,
                          fontSize: '0.95rem',
                          color: '#000000',
                        }}
                      >
                        {formatPrice(item.product.price * item.quantity, currency)}
                      </span>

                      <button
                        onClick={() => onRemoveItem(index)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#71717A',
                          cursor: 'pointer',
                          padding: '2px',
                        }}
                        title="Remove Item"
                        aria-label="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Summary */}
        {items.length > 0 && (
          <div
            style={{
              padding: '1.4rem 1.6rem',
              backgroundColor: '#F8F8FA',
              borderTop: '1px solid #E4E4E7',
            }}
          >
            {/* Promo code form */}
            <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="PROMO CODE (TRY TECH10)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                style={{
                  flex: 1,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #D4D4D8',
                  borderRadius: 'var(--radius-xs)',
                  padding: '0.55rem 0.8rem',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '0.08em',
                  color: '#000000',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: '#000000',
                  border: '1px solid #000000',
                  color: '#FFFFFF',
                  padding: '0.55rem 0.9rem',
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  borderRadius: 'var(--radius-xs)',
                  cursor: 'pointer',
                }}
              >
                APPLY
              </button>
            </form>

            {promoApplied && (
              <span style={{ fontSize: '0.72rem', color: '#10B981', display: 'block', marginBottom: '0.6rem', fontWeight: 600 }}>
                ✓ Promo code TECH10 applied (10% discount).
              </span>
            )}

            {promoError && (
              <span style={{ fontSize: '0.72rem', color: '#EF4444', display: 'block', marginBottom: '0.6rem', fontWeight: 600 }}>
                {promoError}
              </span>
            )}

            {/* Price Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.2rem', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#52525B' }}>
                <span>Subtotal</span>
                <span style={{ color: '#000000', fontWeight: 700 }}>{formatPrice(subtotalUsd, currency)}</span>
              </div>

              {promoApplied && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10B981', fontWeight: 600 }}>
                  <span>VIP Collab Discount (10%)</span>
                  <span>-{formatPrice(discountUsd, currency)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#52525B' }}>
                <span>Express Courier Shipping</span>
                <span style={{ color: isFreeShipping ? '#10B981' : '#000000', fontWeight: 700 }}>
                  {isFreeShipping ? 'FREE' : formatPrice(shippingUsd, currency)}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTop: '1px solid #E4E4E7',
                  paddingTop: '0.6rem',
                  marginTop: '0.3rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 900,
                  fontSize: '1.15rem',
                  color: '#000000',
                }}
              >
                <span>ESTIMATED TOTAL</span>
                <span style={{ color: '#000000' }}>{formatPrice(totalUsd, currency)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={onCheckout}
              className="btn-primary"
              style={{ width: '100%', padding: '1rem', fontSize: '0.85rem' }}
            >
              <span>SECURE CHECKOUT</span>
              <ArrowRight size={16} />
            </button>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                fontSize: '0.7rem',
                color: '#71717A',
                marginTop: '0.8rem',
              }}
            >
              <ShieldCheck size={13} color="#000000" />
              <span>Encrypted SSL • Instant Supabase Order Persistence</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

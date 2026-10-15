import React, { useState } from 'react';
import { X, CheckCircle2, Lock, Shield, Sparkles, Loader2 } from 'lucide-react';
import { CartItem, CurrencyCode, OrderRecord, PaymentSettings } from '../types';
import { formatPrice } from '../lib/currency';
import { createOrder } from '../lib/supabase';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: CurrencyCode;
  onOrderSuccess: () => void;
  paymentSettings?: PaymentSettings;
  freeShippingThreshold?: number;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  onOrderSuccess,
  paymentSettings,
  freeShippingThreshold = 75,
}) => {
  if (!isOpen) return null;

  const [selectedMethod, setSelectedMethod] = useState<'card' | 'cod' | 'paypal'>(
    paymentSettings?.codEnabled && !paymentSettings?.stripeEnabled ? 'cod' : 'card'
  );

  const [formData, setFormData] = useState({
    name: 'Devin Vance',
    email: 'client@techxodia.com',
    phone: '+1 (555) 349-2041',
    address: '420 Modernist Canyon Way',
    city: 'Phoenix',
    state: 'AZ',
    zip: '85001',
    country: 'United States',
    cardNumber: '•••• •••• •••• 4242',
    exp: '08/29',
    cvv: '888',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [createdOrderNumber, setCreatedOrderNumber] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const subtotalUsd = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingUsd = subtotalUsd >= freeShippingThreshold ? 0 : 12;
  const totalUsd = subtotalUsd + shippingUsd;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const generatedNum = `TX-${Math.floor(100000 + Math.random() * 900000)}`;

    const orderPayload: OrderRecord = {
      order_number: generatedNum,
      customer_name: formData.name,
      customer_email: formData.email,
      customer_phone: formData.phone,
      shipping_address: {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        country: formData.country,
      },
      items: items.map((i) => ({
        id: i.product.id || i.product.slug,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        color: i.selectedColor.name,
        customEngraving: i.customEngraving,
      })),
      subtotal: subtotalUsd,
      shipping: shippingUsd,
      discount: 0,
      total: totalUsd,
      currency: currency,
      status: 'confirmed',
    };

    const res = await createOrder(orderPayload);
    setIsSubmitting(false);

    if (res.success) {
      setCreatedOrderNumber(res.orderId || generatedNum);
      setStatusMessage(res.message);
      setOrderComplete(true);

      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#C86237', '#FFA578', '#FFFFFF', '#D8CEBC']
        });
      } catch {
        // ignore
      }

      onOrderSuccess();
    } else {
      alert(`Order error: ${res.message}`);
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
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 110,
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
          backgroundColor: '#121417',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 'var(--radius-sm)',
          maxWidth: '680px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2.5rem',
          position: 'relative',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'none',
            border: 'none',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
          }}
          aria-label="Close Checkout"
        >
          <X size={20} />
        </button>

        {orderComplete ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                border: '2px solid #10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto',
              }}
            >
              <CheckCircle2 size={36} color="#10B981" />
            </div>

            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.74rem',
                fontWeight: 800,
                letterSpacing: '0.2em',
                color: '#10B981',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '0.4rem',
              }}
            >
              ORDER CONFIRMED & PERSISTED
            </span>

            <h2
              style={{
                fontSize: '2rem',
                fontWeight: 900,
                color: '#FFFFFF',
                textTransform: 'uppercase',
                marginBottom: '0.8rem',
              }}
            >
              THANK YOU, {formData.name}
            </h2>

            <p style={{ color: 'var(--color-sand)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.8rem' }}>
              Your numbered Techxodia Series 01 allocation has been locked into the archive registry.
            </p>

            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '1.2rem',
                borderRadius: 'var(--radius-xs)',
                maxWidth: '420px',
                margin: '0 auto 2rem auto',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Order Reference:</span>
                <strong style={{ color: '#FFFFFF', letterSpacing: '0.1em' }}>{createdOrderNumber}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Confirmation Sent To:</span>
                <span style={{ color: '#FFFFFF' }}>{formData.email}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Total Charged:</span>
                <strong style={{ color: 'var(--color-terracotta-light)' }}>{formatPrice(totalUsd, currency)}</strong>
              </div>
              {statusMessage && (
                <div style={{ marginTop: '0.8rem', paddingTop: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.74rem', color: 'var(--color-sand)' }}>
                  {statusMessage}
                </div>
              )}
            </div>

            <button onClick={onClose} className="btn-primary" style={{ padding: '0.85rem 2.2rem' }}>
              CONTINUE BROWSING
            </button>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
              <Lock size={16} color="#FFA578" />
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  letterSpacing: '0.14em',
                  color: '#FFA578',
                  textTransform: 'uppercase',
                }}
              >
                256-BIT ENCRYPTED CHECKOUT
              </span>
            </div>

            <h2
              style={{
                fontSize: '1.7rem',
                fontWeight: 900,
                color: '#FFFFFF',
                textTransform: 'uppercase',
                marginBottom: '1.5rem',
              }}
            >
              SHIPPING & ARCHIVE ALLOCATION
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Delivery Address</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>State / Province</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>ZIP / Postal</label>
                  <input
                    type="text"
                    required
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Payment Gateway Selector */}
              <div
                style={{
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  padding: '1.2rem',
                  borderRadius: 'var(--radius-xs)',
                  marginTop: '0.5rem',
                }}
              >
                <span style={{ ...labelStyle, marginBottom: '0.8rem', display: 'block' }}>
                  Payment Method
                </span>

                <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  {(paymentSettings?.stripeEnabled ?? true) && (
                    <button
                      type="button"
                      onClick={() => setSelectedMethod('card')}
                      style={{
                        padding: '0.5rem 0.9rem',
                        backgroundColor: selectedMethod === 'card' ? 'rgba(200, 98, 55, 0.2)' : 'rgba(255,255,255,0.04)',
                        border: selectedMethod === 'card' ? '1.5px solid var(--color-terracotta)' : '1px solid rgba(255,255,255,0.1)',
                        color: selectedMethod === 'card' ? '#FFFFFF' : 'var(--color-text-secondary)',
                        borderRadius: 'var(--radius-xs)',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        fontFamily: 'var(--font-display)',
                      }}
                    >
                      Credit / Debit (Stripe)
                    </button>
                  )}

                  {paymentSettings?.codEnabled && (
                    <button
                      type="button"
                      onClick={() => setSelectedMethod('cod')}
                      style={{
                        padding: '0.5rem 0.9rem',
                        backgroundColor: selectedMethod === 'cod' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.04)',
                        border: selectedMethod === 'cod' ? '1.5px solid #10B981' : '1px solid rgba(255,255,255,0.1)',
                        color: selectedMethod === 'cod' ? '#FFFFFF' : 'var(--color-text-secondary)',
                        borderRadius: 'var(--radius-xs)',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        fontFamily: 'var(--font-display)',
                      }}
                    >
                      Cash on Delivery / Direct Wire ($0 Fee)
                    </button>
                  )}

                  {paymentSettings?.paypalEnabled && (
                    <button
                      type="button"
                      onClick={() => setSelectedMethod('paypal')}
                      style={{
                        padding: '0.5rem 0.9rem',
                        backgroundColor: selectedMethod === 'paypal' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.04)',
                        border: selectedMethod === 'paypal' ? '1.5px solid #3B82F6' : '1px solid rgba(255,255,255,0.1)',
                        color: selectedMethod === 'paypal' ? '#FFFFFF' : 'var(--color-text-secondary)',
                        borderRadius: 'var(--radius-xs)',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        fontFamily: 'var(--font-display)',
                      }}
                    >
                      PayPal
                    </button>
                  )}
                </div>

                {selectedMethod === 'card' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.8rem' }}>
                    <input
                      type="text"
                      disabled
                      value={formData.cardNumber}
                      style={{ ...inputStyle, opacity: 0.8 }}
                    />
                    <input
                      type="text"
                      disabled
                      value={formData.exp}
                      style={{ ...inputStyle, opacity: 0.8 }}
                    />
                    <input
                      type="text"
                      disabled
                      value={formData.cvv}
                      style={{ ...inputStyle, opacity: 0.8 }}
                    />
                  </div>
                )}

                {selectedMethod === 'cod' && (
                  <div style={{ fontSize: '0.8rem', color: '#10B981', lineHeight: 1.5 }}>
                    {paymentSettings?.codInstructions ||
                      'Pay securely upon courier delivery or via direct manual bank transfer.'}
                  </div>
                )}

                {selectedMethod === 'paypal' && (
                  <div style={{ fontSize: '0.8rem', color: '#60A5FA', lineHeight: 1.5 }}>
                    PayPal Express Checkout will prompt authorization upon order placement.
                  </div>
                )}
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem 0',
                  borderTop: '1px solid rgba(255,255,255,0.1)',
                  marginTop: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Total Amount</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-terracotta-light)' }}>
                    {formatPrice(totalUsd, currency)}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary"
                  style={{ minWidth: '220px' }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="spin-icon" />
                      <span>CONNECTING TO SUPABASE...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      <span>CONFIRM & PLACE ORDER</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.7rem',
  fontWeight: 700,
  fontFamily: 'var(--font-display)',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'var(--color-text-secondary)',
  marginBottom: '0.4rem',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  borderRadius: 'var(--radius-xs)',
  padding: '0.75rem 0.9rem',
  color: '#FFFFFF',
  fontSize: '0.88rem',
  outline: 'none',
  fontFamily: 'var(--font-sans)',
};

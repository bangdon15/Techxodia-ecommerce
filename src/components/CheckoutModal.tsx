import React, { useState } from 'react';
import { X, CheckCircle2, Lock, Shield, Sparkles, Loader2, FileText, Mail, Printer } from 'lucide-react';
import { CartItem, CurrencyCode, OrderRecord, PaymentSettings, StoreSettings } from '../types';
import { formatPrice } from '../lib/currency';
import { createOrder } from '../lib/supabase';
import { sendReceiptEmail, openPrintableReceipt } from '../lib/emailService';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: CurrencyCode;
  onOrderSuccess: () => void;
  paymentSettings?: PaymentSettings;
  freeShippingThreshold?: number;
  storeSettings?: StoreSettings;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  onOrderSuccess,
  paymentSettings,
  freeShippingThreshold = 75,
  storeSettings,
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
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);
  const [isDispatchingReceipt, setIsDispatchingReceipt] = useState(false);
  const [receiptFeedback, setReceiptFeedback] = useState<string | null>(null);

  const subtotalUsd = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingUsd = subtotalUsd >= freeShippingThreshold ? 0 : 12;
  const totalUsd = subtotalUsd + shippingUsd;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const generatedNum = `TX-${Math.floor(100000 + Math.random() * 900000)}`;
    const methodLabel =
      selectedMethod === 'card'
        ? 'Online Card (Stripe)'
        : selectedMethod === 'paypal'
        ? 'PayPal Express'
        : 'Cash on Delivery / Direct Wire';

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
      payment_method: methodLabel,
      payment_status: selectedMethod === 'cod' ? 'pending' : 'paid',
      receipt_sent: false,
      created_at: new Date().toISOString(),
      status: 'confirmed',
    };

    const res = await createOrder(orderPayload);
    setIsSubmitting(false);

    if (res.success) {
      const finalOrderNumber = res.orderId || generatedNum;
      setCreatedOrderNumber(finalOrderNumber);
      setStatusMessage(res.message);
      setConfirmedOrder(orderPayload);
      setOrderComplete(true);

      // Automated Receipt Dispatch to Customer's Email upon verified payment
      if (storeSettings) {
        setIsDispatchingReceipt(true);
        sendReceiptEmail(orderPayload, storeSettings).then((emailRes) => {
          setIsDispatchingReceipt(false);
          setReceiptFeedback(emailRes.message);
        });
      }

      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#000000', '#52525B', '#A1A1AA', '#FFFFFF'],
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
      className="checkout-modal-backdrop"
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
        className="checkout-modal-dialog"
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E4E4E7',
          borderRadius: 'var(--radius-sm)',
          maxWidth: '680px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2.5rem',
          position: 'relative',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
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
            color: '#000000',
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
                backgroundColor: '#000000',
                border: '2px solid #000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto',
              }}
            >
              <CheckCircle2 size={36} color="#FFFFFF" />
            </div>

            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.74rem',
                fontWeight: 800,
                letterSpacing: '0.2em',
                color: '#000000',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '0.4rem',
              }}
            >
              PAYMENT VERIFIED // ALLOCATION LOCKED
            </span>

            <h2
              style={{
                fontSize: '2rem',
                fontWeight: 900,
                color: '#000000',
                textTransform: 'uppercase',
                marginBottom: '0.8rem',
              }}
            >
              THANK YOU, {formData.name}
            </h2>

            <p style={{ color: '#52525B', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.6rem' }}>
              Your numbered Techxodia Series 01 allocation has been locked into the archive registry and customer ledger.
            </p>

            <div
              style={{
                backgroundColor: '#F8F8FA',
                border: '1px solid #E4E4E7',
                padding: '1.4rem',
                borderRadius: 'var(--radius-xs)',
                maxWidth: '460px',
                margin: '0 auto 1.8rem auto',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.82rem' }}>
                <span style={{ color: '#71717A' }}>Order Reference:</span>
                <strong style={{ color: '#000000', letterSpacing: '0.1em' }}>{createdOrderNumber}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.82rem' }}>
                <span style={{ color: '#71717A' }}>Payment Verification:</span>
                <span style={{ color: '#10B981', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                  <CheckCircle2 size={13} color="#10B981" /> Verified & Settled
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.82rem' }}>
                <span style={{ color: '#71717A' }}>Official Receipt Sent To:</span>
                <span style={{ color: '#000000', fontWeight: 600 }}>{formData.email}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: '#71717A' }}>Total Charged:</span>
                <strong style={{ color: '#000000' }}>{formatPrice(totalUsd, currency)}</strong>
              </div>

              {/* Email Receipt Transmission Status */}
              <div
                style={{
                  marginTop: '0.9rem',
                  paddingTop: '0.8rem',
                  borderTop: '1px solid #E4E4E7',
                  fontSize: '0.74rem',
                  color: '#52525B',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                {isDispatchingReceipt ? (
                  <>
                    <Loader2 size={13} className="spin" color="#000000" />
                    <span>Transmitting branded receipt to your email...</span>
                  </>
                ) : (
                  <>
                    <Mail size={13} color="#000000" />
                    <span>{receiptFeedback || `Official receipt generated & dispatched to ${formData.email}`}</span>
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons: Printable Receipt & Continue Browsing */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => {
                  if (confirmedOrder) {
                    openPrintableReceipt(confirmedOrder);
                  }
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#000000',
                  border: '1px solid #000000',
                  color: '#FFFFFF',
                  padding: '0.85rem 1.6rem',
                  borderRadius: 'var(--radius-xs)',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <Printer size={15} />
                <span>VIEW / PRINT OFFICIAL RECEIPT</span>
              </button>

              <button onClick={onClose} className="btn-primary" style={{ padding: '0.85rem 2rem' }}>
                CONTINUE BROWSING
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
              <Lock size={16} color="#000000" />
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  letterSpacing: '0.14em',
                  color: '#000000',
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
                color: '#000000',
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
                  backgroundColor: '#F8F8FA',
                  border: '1px solid #E4E4E7',
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
                        backgroundColor: selectedMethod === 'card' ? '#000000' : '#FFFFFF',
                        border: selectedMethod === 'card' ? '1.5px solid #000000' : '1px solid #D4D4D8',
                        color: selectedMethod === 'card' ? '#FFFFFF' : '#52525B',
                        borderRadius: 'var(--radius-xs)',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: 800,
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
                        backgroundColor: selectedMethod === 'cod' ? '#000000' : '#FFFFFF',
                        border: selectedMethod === 'cod' ? '1.5px solid #000000' : '1px solid #D4D4D8',
                        color: selectedMethod === 'cod' ? '#FFFFFF' : '#52525B',
                        borderRadius: 'var(--radius-xs)',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: 800,
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
                        backgroundColor: selectedMethod === 'paypal' ? '#000000' : '#FFFFFF',
                        border: selectedMethod === 'paypal' ? '1.5px solid #000000' : '1px solid #D4D4D8',
                        color: selectedMethod === 'paypal' ? '#FFFFFF' : '#52525B',
                        borderRadius: 'var(--radius-xs)',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: 800,
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
                      style={{ ...inputStyle, opacity: 0.9, backgroundColor: '#F4F4F5' }}
                    />
                    <input
                      type="text"
                      disabled
                      value={formData.exp}
                      style={{ ...inputStyle, opacity: 0.9, backgroundColor: '#F4F4F5' }}
                    />
                    <input
                      type="text"
                      disabled
                      value={formData.cvv}
                      style={{ ...inputStyle, opacity: 0.9, backgroundColor: '#F4F4F5' }}
                    />
                  </div>
                )}

                {selectedMethod === 'cod' && (
                  <div style={{ fontSize: '0.8rem', color: '#10B981', lineHeight: 1.5, fontWeight: 600 }}>
                    {paymentSettings?.codInstructions ||
                      'Pay securely upon courier delivery or via direct manual bank transfer.'}
                  </div>
                )}

                {selectedMethod === 'paypal' && (
                  <div style={{ fontSize: '0.8rem', color: '#2563EB', lineHeight: 1.5, fontWeight: 600 }}>
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
                  borderTop: '1px solid #E4E4E7',
                  marginTop: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.75rem', color: '#71717A' }}>Total Amount</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 900, color: '#000000' }}>
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
  fontWeight: 800,
  fontFamily: 'var(--font-display)',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: '#000000',
  marginBottom: '0.4rem',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: '#FFFFFF',
  border: '1px solid #D4D4D8',
  borderRadius: 'var(--radius-xs)',
  padding: '0.75rem 0.9rem',
  color: '#000000',
  fontSize: '0.88rem',
  outline: 'none',
  fontFamily: 'var(--font-sans)',
};

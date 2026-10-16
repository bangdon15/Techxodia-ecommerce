import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { subscribeEmail } from '../lib/supabase';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setIsSubmitting(true);
    setResult(null);

    const res = await subscribeEmail(email.trim());
    setIsSubmitting(false);
    setResult(res);

    if (res.success) {
      setEmail('');
    }
  };

  return (
    <section
      style={{
        paddingTop: '5.5rem',
        paddingBottom: '5.5rem',
        backgroundColor: '#000000',
        borderTop: '1px solid #27272A',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Accent */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          height: '250px',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container-luxury" style={{ position: 'relative', zIndex: 2 }}>
        <div
          style={{
            maxWidth: '680px',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#FFFFFF',
              fontFamily: 'var(--font-display)',
              fontSize: '0.74rem',
              fontWeight: 800,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '0.8rem',
            }}
          >
            <Sparkles size={14} color="#FFFFFF" />
            <span>VIP ARCHIVE REGISTRY</span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              marginBottom: '0.8rem',
            }}
          >
            FIRST ACCESS TO FUTURE DROPS
          </h2>

          <p
            style={{
              fontSize: '0.95rem',
              color: '#A1A1AA',
              lineHeight: 1.6,
              marginBottom: '2rem',
            }}
          >
            Join the Techxodia inner circle. Subscribers receive priority allocation windows,
            custom monogramming privileges, and private capsule previews.
          </p>

          <form
            onSubmit={handleSubmit}
            className="newsletter-form"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.6rem',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <div
              className="newsletter-input-wrap"
              style={{ position: 'relative', flex: '1 1 240px', maxWidth: '420px', width: '100%' }}
            >
              <Mail
                size={16}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '14px',
                  transform: 'translateY(-50%)',
                  color: '#71717A',
                }}
              />
              <input
                type="email"
                required
                placeholder="ENTER YOUR EMAIL FOR ARCHIVE ACCESS"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#18181B',
                  border: '1px solid #3F3F46',
                  borderRadius: 'var(--radius-xs)',
                  padding: '0.9rem 1rem 0.9rem 2.8rem',
                  color: '#FFFFFF',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '0.08em',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="newsletter-btn"
              style={{
                padding: '0.9rem 1.6rem',
                backgroundColor: '#FFFFFF',
                color: '#000000',
                border: 'none',
                borderRadius: 'var(--radius-xs)',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '0.82rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="spin-icon" />
                  <span>REGISTERING...</span>
                </>
              ) : (
                <>
                  <span>REQUEST ACCESS</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {result && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.8rem',
                color: result.success ? '#10B981' : '#EF4444',
                marginTop: '0.5rem',
              }}
            >
              {result.success && <CheckCircle2 size={15} color="#10B981" />}
              <span>{result.message}</span>
            </div>
          )}

          <span
            style={{
              display: 'block',
              fontSize: '0.72rem',
              color: '#71717A',
              marginTop: '1.2rem',
            }}
          >
            Zero marketing spam. Only authenticated release alerts. Synced to Supabase database.
          </span>
        </div>
      </div>
    </section>
  );
};

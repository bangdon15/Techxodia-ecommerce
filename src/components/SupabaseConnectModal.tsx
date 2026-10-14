import React, { useState } from 'react';
import { X, Database, CheckCircle, AlertCircle, RefreshCw, Key, ExternalLink, Code } from 'lucide-react';
import { getStoredCredentials, testSupabaseConnection } from '../lib/supabase';

interface SupabaseConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshApp: () => void;
}

export const SupabaseConnectModal: React.FC<SupabaseConnectModalProps> = ({
  isOpen,
  onClose,
  onRefreshApp,
}) => {
  if (!isOpen) return null;

  const stored = getStoredCredentials();
  const [url, setUrl] = useState(stored.url);
  const [key, setKey] = useState(stored.key);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    tableFound?: boolean;
  } | null>(null);

  const handleSaveAndTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setTesting(true);
    setTestResult(null);

    const cleanUrl = url.trim();
    const cleanKey = key.trim();

    localStorage.setItem('techxodia_supabase_url', cleanUrl);
    localStorage.setItem('techxodia_supabase_key', cleanKey);

    const res = await testSupabaseConnection(cleanUrl, cleanKey);
    setTesting(false);
    setTestResult(res);

    if (res.success) {
      onRefreshApp();
    }
  };

  const handleClear = () => {
    localStorage.removeItem('techxodia_supabase_url');
    localStorage.removeItem('techxodia_supabase_key');
    setUrl('');
    setKey('');
    setTestResult(null);
    onRefreshApp();
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
        zIndex: 120,
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
          maxWidth: '620px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2.4rem',
          position: 'relative',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85)',
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
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
          <Database size={22} style={{ color: 'var(--color-terracotta)' }} />
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.4rem',
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            SUPABASE LIVE CONNECTION
          </h2>
        </div>

        <p style={{ fontSize: '0.86rem', color: 'var(--color-sand)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          Techxodia is engineered to read products, persist orders, and log VIP drops directly
          into Supabase PostgreSQL. Configure your credentials below or via <code>.env</code>.
        </p>

        {/* Status Indicator Banner */}
        <div
          style={{
            backgroundColor: stored.isConfigured ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
            border: stored.isConfigured ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: 'var(--radius-xs)',
            padding: '1rem',
            marginBottom: '1.8rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.8rem',
          }}
        >
          {stored.isConfigured ? (
            <CheckCircle size={20} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
          ) : (
            <AlertCircle size={20} color="#F59E0B" style={{ flexShrink: 0, marginTop: '2px' }} />
          )}

          <div>
            <h4
              style={{
                fontSize: '0.88rem',
                fontWeight: 800,
                color: stored.isConfigured ? '#10B981' : '#F59E0B',
                fontFamily: 'var(--font-display)',
                textTransform: 'uppercase',
                marginBottom: '0.2rem',
              }}
            >
              {stored.isConfigured ? 'Supabase Credentials Detected' : 'Local Fallback Catalog Mode Active'}
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
              {stored.isConfigured
                ? `Endpoint: ${stored.url}`
                : 'The storefront is currently rendering the complete pre-seeded high-fidelity catalog so you can review UI & checkout immediately. Connect your live Supabase database below to persist data.'}
            </p>
          </div>
        </div>

        {/* Form to enter/update credentials live */}
        <form onSubmit={handleSaveAndTest} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label style={labelStyle}>Supabase Project URL</label>
            <input
              type="url"
              placeholder="https://xyzcompany.supabase.co"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Supabase Anon Public API Key</label>
            <input
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          {testResult && (
            <div
              style={{
                padding: '0.9rem',
                borderRadius: 'var(--radius-xs)',
                backgroundColor: testResult.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                border: testResult.success ? '1px solid #10B981' : '1px solid #EF4444',
                fontSize: '0.8rem',
                color: testResult.success ? '#10B981' : '#EF4444',
              }}
            >
              {testResult.message}
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.5rem' }}>
            <button
              type="submit"
              disabled={testing}
              className="btn-primary"
              style={{ flex: 1, padding: '0.85rem' }}
            >
              {testing ? (
                <>
                  <RefreshCw size={15} className="spin-icon" />
                  <span>TESTING SUPABASE...</span>
                </>
              ) : (
                <>
                  <Key size={15} />
                  <span>SAVE & VERIFY LIVE SYNC</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleClear}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: 'var(--color-text-secondary)',
                padding: '0.85rem 1.2rem',
                borderRadius: 'var(--radius-xs)',
                cursor: 'pointer',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '0.74rem',
                letterSpacing: '0.1em',
              }}
            >
              RESET TO DEMO
            </button>
          </div>
        </form>

        {/* Database Setup instructions */}
        <div
          style={{
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem' }}>
            <Code size={15} color="#FFA578" />
            <span
              style={{
                fontSize: '0.75rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                letterSpacing: '0.12em',
                color: '#FFA578',
                textTransform: 'uppercase',
              }}
            >
              Database Migration Ready
            </span>
          </div>

          <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: '0.8rem' }}>
            A complete PostgreSQL migration script is included in your project at:
            <code style={{ display: 'block', padding: '0.4rem', backgroundColor: 'rgba(0,0,0,0.4)', color: 'var(--color-sand)', margin: '0.4rem 0', borderRadius: '2px' }}>
              supabase/schema.sql
            </code>
            Execute it in your Supabase dashboard SQL editor to create <code>products</code>, <code>orders</code>, and <code>subscribers</code> tables with Row-Level-Security (RLS).
          </p>

          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--color-terracotta-light)',
              fontSize: '0.75rem',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            <span>Open Supabase Dashboard</span>
            <ExternalLink size={12} />
          </a>
        </div>
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
  fontSize: '0.85rem',
  outline: 'none',
  fontFamily: 'var(--font-sans)',
};

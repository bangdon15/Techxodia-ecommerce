import React, { useState } from 'react';
import {
  X,
  Database,
  Package,
  Image as ImageIcon,
  Sliders,
  CreditCard,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Sparkles,
  Save,
  HelpCircle,
  CheckCircle2,
  Lock,
  Layers,
} from 'lucide-react';
import { Product, ProductColor, StoreSettings } from '../types';
import { WALLPAPER_PRESETS, saveStoreSettings } from '../lib/settings';
import {
  getSupabaseClient,
  saveSupabaseConfig,
  getSupabaseConfig,
  seedSupabaseDatabase,
  upsertProduct,
  deleteProduct,
} from '../lib/supabase';
import { INITIAL_PRODUCTS } from '../data/initialProducts';
import confetti from 'canvas-confetti';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onRefreshCatalog: () => void;
  storeSettings: StoreSettings;
  onUpdateSettings: (newSettings: StoreSettings) => void;
}

type AdminTab = 'database' | 'products' | 'wallpaper' | 'details' | 'payment';

export const AdminPortal: React.FC<AdminPortalProps> = ({
  isOpen,
  onClose,
  products,
  onRefreshCatalog,
  storeSettings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<AdminTab>('database');

  // Database Tab States
  const existingConfig = getSupabaseConfig();
  const [supabaseUrl, setSupabaseUrl] = useState(existingConfig.url);
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(existingConfig.anonKey);
  const [dbTestStatus, setDbTestStatus] = useState<{
    tested: boolean;
    success: boolean;
    message: string;
  }>({ tested: false, success: false, message: '' });
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<string | null>(null);

  // Store Settings Local Copy
  const [settingsForm, setSettingsForm] = useState<StoreSettings>({ ...storeSettings });
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Products Tab States
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [productActionLoading, setProductActionLoading] = useState(false);
  const [productMessage, setProductMessage] = useState<string | null>(null);

  // Database Connection Test
  const handleTestConnection = async () => {
    setDbTestStatus({ tested: false, success: false, message: 'Pinging Supabase...' });
    saveSupabaseConfig(supabaseUrl.trim(), supabaseAnonKey.trim());
    const client = getSupabaseClient();
    if (!client) {
      setDbTestStatus({
        tested: true,
        success: false,
        message: 'Could not initialize client. Check URL and Key formatting.',
      });
      return;
    }

    try {
      const { data, error } = await client.from('products').select('count', { count: 'exact', head: true });
      if (error && error.code !== 'PGRST116') {
        // If table doesn't exist yet, it's connected to Supabase but needs seeding
        if (error.message.includes('relation "public.products" does not exist')) {
          setDbTestStatus({
            tested: true,
            success: true,
            message: 'Connected to Supabase! The "products" table needs to be created or seeded.',
          });
          return;
        }
        setDbTestStatus({
          tested: true,
          success: false,
          message: `Supabase Error: ${error.message}`,
        });
      } else {
        setDbTestStatus({
          tested: true,
          success: true,
          message: 'Supabase connection verified successfully! Products table is accessible.',
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setDbTestStatus({ tested: true, success: false, message: `Connection failed: ${msg}` });
    }
  };

  // Seed Supabase Database
  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    setSeedResult(null);
    saveSupabaseConfig(supabaseUrl.trim(), supabaseAnonKey.trim());
    const res = await seedSupabaseDatabase();
    setIsSeeding(false);
    setSeedResult(res.message);
    if (res.success) {
      onRefreshCatalog();
      try {
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
    }
  };

  // Save Settings Changes
  const handleSaveStoreSettings = async () => {
    const res = await saveStoreSettings(settingsForm);
    setSaveStatus(res.message);
    if (res.success) {
      onUpdateSettings(settingsForm);
      setTimeout(() => setSaveStatus(null), 3500);
    }
  };

  // Product CRUD
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setProductActionLoading(true);
    setProductMessage(null);

    const res = await upsertProduct(editingProduct);
    setProductActionLoading(false);
    setProductMessage(res.message);

    if (res.success) {
      onRefreshCatalog();
      setTimeout(() => {
        setEditingProduct(null);
        setIsCreatingProduct(false);
        setProductMessage(null);
      }, 1200);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    setProductActionLoading(true);
    const res = await deleteProduct(id);
    setProductActionLoading(false);
    setProductMessage(res.message);
    if (res.success) {
      onRefreshCatalog();
      setTimeout(() => setProductMessage(null), 2500);
    }
  };

  const handleStartNewProduct = () => {
    const newId = `TX-${Date.now().toString().slice(-4)}`;
    setEditingProduct({
      id: newId,
      slug: `tx-${Date.now().toString().slice(-4)}`,
      name: 'NEW EDITION VESSEL',
      subtitle: 'LIMITED ARCHIVAL RUN',
      category: 'Hydration Vessels',
      price: 65,
      original_price: 75,
      rating: 5.0,
      reviews_count: 1,
      image: '/assets/product_jug_64oz.jpg',
      gallery: ['/assets/product_jug_64oz.jpg'],
      colors: [
        { name: 'Desert Terracotta', hex: '#C86237', image: '/assets/product_jug_64oz.jpg' },
        { name: 'Volcanic Obsidian', hex: '#1F2124', image: '/assets/product_jug_obsidian.jpg' },
      ],
      capacity: '32 OZ / 950 ML',
      specs: [
        { label: 'Thermal Retention', value: '30 Hrs Cold / 12 Hrs Hot' },
        { label: 'Construction', value: 'Recycled 18/8 Stainless Steel' },
      ],
      badge: 'NEW ARRIVAL',
      description: 'Engineered for relentless performance and quiet luxury in every environment.',
      stock: 45,
      is_featured: true,
    });
    setIsCreatingProduct(true);
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
        backgroundColor: 'rgba(0, 0, 0, 0.88)',
        backdropFilter: 'blur(14px)',
        zIndex: 120,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.25s ease-out',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#111317',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 'var(--radius-sm)',
          maxWidth: '1100px',
          width: '100%',
          height: '92vh',
          maxHeight: '850px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(200, 98, 55, 0.2)',
          position: 'relative',
        }}
      >
        {/* Top Header Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.2rem 1.8rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: '#14161B',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: 'rgba(200, 98, 55, 0.18)',
                border: '1px solid rgba(200, 98, 55, 0.4)',
                borderRadius: 'var(--radius-xs)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sliders size={18} color="#FFA578" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h2
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 900,
                    letterSpacing: '0.1em',
                    color: '#FFFFFF',
                    textTransform: 'uppercase',
                  }}
                >
                  TECHXODIA // CONTROL PORTAL
                </h2>
                <span
                  style={{
                    fontSize: '0.62rem',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    color: '#10B981',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    padding: '0.15rem 0.5rem',
                    borderRadius: 'var(--radius-xs)',
                  }}
                >
                  MASTER ADMIN
                </span>
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                Configure database, storefront catalog, visual wallpaper, and payment options.
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            aria-label="Close Admin"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation Navigation Bar */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#0D0E11',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            overflowX: 'auto',
            padding: '0 1rem',
          }}
        >
          <button
            onClick={() => {
              setActiveTab('database');
              setEditingProduct(null);
            }}
            style={tabButtonStyle(activeTab === 'database')}
          >
            <Database size={15} />
            <span>1. Database & Supabase</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('products');
              setEditingProduct(null);
            }}
            style={tabButtonStyle(activeTab === 'products')}
          >
            <Package size={15} />
            <span>2. Storefront Products ({products.length})</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('wallpaper');
              setEditingProduct(null);
            }}
            style={tabButtonStyle(activeTab === 'wallpaper')}
          >
            <ImageIcon size={15} />
            <span>3. Wallpaper & Hero</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('details');
              setEditingProduct(null);
            }}
            style={tabButtonStyle(activeTab === 'details')}
          >
            <Layers size={15} />
            <span>4. Store Details</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('payment');
              setEditingProduct(null);
            }}
            style={tabButtonStyle(activeTab === 'payment')}
          >
            <CreditCard size={15} />
            <span>5. Payment Options</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '2rem',
            backgroundColor: '#111317',
          }}
        >
          {/* TAB 1: DATABASE & SUPABASE */}
          {activeTab === 'database' && (
            <div style={{ maxWidth: '820px' }}>
              <div
                style={{
                  backgroundColor: 'rgba(200, 98, 55, 0.08)',
                  border: '1px solid rgba(200, 98, 55, 0.25)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '1.2rem',
                  marginBottom: '1.8rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.8rem',
                }}
              >
                <Database size={20} color="#FFA578" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <h4 style={{ color: '#FFFFFF', fontSize: '0.92rem', marginBottom: '0.3rem' }}>
                    Zero-Code Supabase Integration
                  </h4>
                  <p style={{ color: 'var(--color-sand)', fontSize: '0.8rem', lineHeight: 1.5 }}>
                    Connect directly to your free Supabase PostgreSQL cloud database. Once connected,
                    all products, newsletter subscriptions, orders, and custom settings persist
                    directly to your live table in the cloud.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '2rem' }}>
                <div>
                  <label style={fieldLabelStyle}>Supabase Project URL</label>
                  <input
                    type="url"
                    placeholder="https://xyzcompany.supabase.co"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    style={fieldInputStyle}
                  />
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '0.3rem', display: 'block' }}>
                    Found in your Supabase project dashboard under Settings &gt; API.
                  </span>
                </div>

                <div>
                  <label style={fieldLabelStyle}>Supabase Anon / Public API Key</label>
                  <input
                    type="password"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={supabaseAnonKey}
                    onChange={(e) => setSupabaseAnonKey(e.target.value)}
                    style={fieldInputStyle}
                  />
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '0.3rem', display: 'block' }}>
                    The safe public anonymous key (anon public).
                  </span>
                </div>

                {/* Connection Status Box */}
                {dbTestStatus.tested && (
                  <div
                    style={{
                      padding: '0.9rem 1.2rem',
                      borderRadius: 'var(--radius-xs)',
                      backgroundColor: dbTestStatus.success ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                      border: dbTestStatus.success ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                      color: dbTestStatus.success ? '#10B981' : '#EF4444',
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                    }}
                  >
                    {dbTestStatus.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    <span>{dbTestStatus.message}</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                  <button
                    onClick={handleTestConnection}
                    className="btn-secondary"
                    style={{ minHeight: '44px', padding: '0.7rem 1.4rem' }}
                  >
                    <RefreshCw size={14} />
                    <span>TEST CONNECTION</span>
                  </button>

                  <button
                    onClick={handleSeedDatabase}
                    disabled={isSeeding}
                    className="btn-primary"
                    style={{ minHeight: '44px', padding: '0.7rem 1.6rem' }}
                  >
                    <Sparkles size={14} />
                    <span>{isSeeding ? 'SEEDING DATABASE...' : 'SEED SUPABASE WITH DEMO CATALOG'}</span>
                  </button>
                </div>

                {seedResult && (
                  <div
                    style={{
                      padding: '0.8rem 1rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      fontSize: '0.78rem',
                      color: 'var(--color-sand)',
                      borderRadius: 'var(--radius-xs)',
                    }}
                  >
                    {seedResult}
                  </div>
                )}
              </div>

              {/* SQL Schema Reference Card */}
              <div
                style={{
                  backgroundColor: '#0D0E11',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '1.2rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Automated Table Creation SQL
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-terracotta)' }}>Supabase SQL Editor Ready</span>
                </div>
                <pre
                  style={{
                    backgroundColor: '#070809',
                    padding: '1rem',
                    borderRadius: 'var(--radius-xs)',
                    fontSize: '0.72rem',
                    color: '#A39B8B',
                    overflowX: 'auto',
                    fontFamily: 'monospace',
                    lineHeight: 1.4,
                  }}
                >{`-- Run this once in your Supabase SQL Editor if needed:
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  subtitle TEXT,
  category TEXT DEFAULT 'Hydration Vessels',
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  rating NUMERIC DEFAULT 5.0,
  reviews_count INT DEFAULT 0,
  image TEXT NOT NULL,
  gallery JSONB DEFAULT '[]'::jsonb,
  colors JSONB DEFAULT '[]'::jsonb,
  capacity TEXT,
  specs JSONB DEFAULT '[]'::jsonb,
  badge TEXT,
  description TEXT,
  stock INT DEFAULT 100,
  is_featured BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable public read access for storefront visitors
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow Insert/Update" ON public.products FOR ALL USING (true);`}</pre>
              </div>
            </div>
          )}

          {/* TAB 2: STOREFRONT PRODUCTS CRUD */}
          {activeTab === 'products' && (
            <div>
              {!editingProduct ? (
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1.5rem',
                      flexWrap: 'wrap',
                      gap: '1rem',
                    }}
                  >
                    <div>
                      <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', textTransform: 'uppercase', fontWeight: 800 }}>
                        Catalog Inventory ({products.length} Items)
                      </h3>
                      <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                        Add, edit specifications, modify pricing, upload images, or adjust color variations.
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.8rem' }}>
                      <button onClick={handleStartNewProduct} className="btn-primary" style={{ padding: '0.65rem 1.2rem' }}>
                        <Plus size={15} />
                        <span>ADD NEW PRODUCT</span>
                      </button>
                    </div>
                  </div>

                  {productMessage && (
                    <div
                      style={{
                        padding: '0.8rem 1.2rem',
                        marginBottom: '1.2rem',
                        backgroundColor: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        color: '#10B981',
                        fontSize: '0.82rem',
                        borderRadius: 'var(--radius-xs)',
                      }}
                    >
                      {productMessage}
                    </div>
                  )}

                  {/* Products Table */}
                  <div
                    style={{
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: 'var(--radius-xs)',
                      overflowX: 'auto',
                      backgroundColor: '#14161A',
                    }}
                  >
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#0D0E11', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                          <th style={tableThStyle}>Thumb</th>
                          <th style={tableThStyle}>Product Name & Subtitle</th>
                          <th style={tableThStyle}>Category</th>
                          <th style={tableThStyle}>Price</th>
                          <th style={tableThStyle}>Stock</th>
                          <th style={tableThStyle}>Colorways</th>
                          <th style={{ ...tableThStyle, textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((p) => (
                          <tr
                            key={p.id || p.slug}
                            style={{
                              borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                              transition: 'background 0.15s',
                            }}
                          >
                            <td style={tableTdStyle}>
                              <img
                                src={p.image}
                                alt={p.name}
                                style={{
                                  width: '44px',
                                  height: '44px',
                                  objectFit: 'cover',
                                  borderRadius: 'var(--radius-xs)',
                                  backgroundColor: '#1E2127',
                                }}
                              />
                            </td>
                            <td style={tableTdStyle}>
                              <strong style={{ color: '#FFFFFF', display: 'block' }}>{p.name}</strong>
                              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{p.subtitle}</span>
                            </td>
                            <td style={tableTdStyle}>
                              <span style={{ color: 'var(--color-sand)', fontSize: '0.75rem' }}>{p.category}</span>
                            </td>
                            <td style={tableTdStyle}>
                              <span style={{ fontWeight: 800, color: '#FFFFFF' }}>${p.price}</span>
                              {p.original_price && (
                                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginLeft: '4px', textDecoration: 'line-through' }}>
                                  ${p.original_price}
                                </span>
                              )}
                            </td>
                            <td style={tableTdStyle}>
                              <span
                                style={{
                                  display: 'inline-block',
                                  padding: '0.2rem 0.5rem',
                                  borderRadius: 'var(--radius-xs)',
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  backgroundColor: p.stock > 10 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                  color: p.stock > 10 ? '#10B981' : '#EF4444',
                                }}
                              >
                                {p.stock} in stock
                              </span>
                            </td>
                            <td style={tableTdStyle}>
                              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                {p.colors.map((c, i) => (
                                  <span
                                    key={i}
                                    title={c.name}
                                    style={{
                                      width: '14px',
                                      height: '14px',
                                      borderRadius: '50%',
                                      backgroundColor: c.hex,
                                      border: '1px solid rgba(255, 255, 255, 0.3)',
                                      display: 'inline-block',
                                    }}
                                  />
                                ))}
                                <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', marginLeft: '4px' }}>
                                  ({p.colors.length})
                                </span>
                              </div>
                            </td>
                            <td style={{ ...tableTdStyle, textAlign: 'right' }}>
                              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                <button
                                  onClick={() => setEditingProduct({ ...p })}
                                  style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                                    border: '1px solid rgba(255, 255, 255, 0.12)',
                                    color: '#FFFFFF',
                                    padding: '0.35rem 0.75rem',
                                    borderRadius: 'var(--radius-xs)',
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                  }}
                                >
                                  EDIT
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(p.id, p.name)}
                                  style={{
                                    backgroundColor: 'rgba(239, 68, 68, 0.12)',
                                    border: '1px solid rgba(239, 68, 68, 0.25)',
                                    color: '#EF4444',
                                    padding: '0.35rem 0.6rem',
                                    borderRadius: 'var(--radius-xs)',
                                    cursor: 'pointer',
                                  }}
                                  title="Delete Product"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* Edit / Create Form */
                <form onSubmit={handleSaveProduct} style={{ maxWidth: '820px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', textTransform: 'uppercase', fontWeight: 800 }}>
                      {isCreatingProduct ? 'Create New Archival Product' : `Edit: ${editingProduct.name}`}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      style={{
                        background: 'none',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: 'var(--color-text-secondary)',
                        padding: '0.4rem 0.8rem',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        borderRadius: 'var(--radius-xs)',
                      }}
                    >
                      Cancel
                    </button>
                  </div>

                  {productMessage && (
                    <div
                      style={{
                        padding: '0.8rem 1.2rem',
                        marginBottom: '1.2rem',
                        backgroundColor: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        color: '#10B981',
                        fontSize: '0.82rem',
                        borderRadius: 'var(--radius-xs)',
                      }}
                    >
                      {productMessage}
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label style={fieldLabelStyle}>Product Name</label>
                      <input
                        type="text"
                        required
                        value={editingProduct.name}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        style={fieldInputStyle}
                      />
                    </div>
                    <div>
                      <label style={fieldLabelStyle}>Category</label>
                      <select
                        value={editingProduct.category}
                        onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                        style={fieldInputStyle}
                      >
                        <option value="Hydration Vessels">Hydration Vessels</option>
                        <option value="Field Gear">Field Gear</option>
                        <option value="Bar & Social">Bar & Social</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label style={fieldLabelStyle}>Price (USD)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={editingProduct.price}
                        onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                        style={fieldInputStyle}
                      />
                    </div>
                    <div>
                      <label style={fieldLabelStyle}>Original / Retail Price (USD)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={editingProduct.original_price || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, original_price: parseFloat(e.target.value) || null })}
                        style={fieldInputStyle}
                      />
                    </div>
                    <div>
                      <label style={fieldLabelStyle}>Stock Units</label>
                      <input
                        type="number"
                        required
                        value={editingProduct.stock}
                        onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })}
                        style={fieldInputStyle}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label style={fieldLabelStyle}>Subtitle / Subheading</label>
                      <input
                        type="text"
                        value={editingProduct.subtitle}
                        onChange={(e) => setEditingProduct({ ...editingProduct, subtitle: e.target.value })}
                        style={fieldInputStyle}
                      />
                    </div>
                    <div>
                      <label style={fieldLabelStyle}>Capacity / Sizing</label>
                      <input
                        type="text"
                        value={editingProduct.capacity}
                        onChange={(e) => setEditingProduct({ ...editingProduct, capacity: e.target.value })}
                        style={fieldInputStyle}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={fieldLabelStyle}>Primary Image URL or Asset Path</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.image}
                      onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                      style={fieldInputStyle}
                    />
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '0.2rem', display: 'block' }}>
                      Examples: /assets/product_jug_64oz.jpg or external HTTPS Unsplash / Supabase storage URL.
                    </span>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={fieldLabelStyle}>Product Editorial Description</label>
                    <textarea
                      rows={3}
                      value={editingProduct.description}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      style={{ ...fieldInputStyle, resize: 'vertical' }}
                    />
                  </div>

                  {/* Colorways Configurator */}
                  <div
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      padding: '1.2rem',
                      borderRadius: 'var(--radius-xs)',
                      marginBottom: '1.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase' }}>
                        Color Variations & Dedicated Photos
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const nextColors = [
                            ...editingProduct.colors,
                            { name: 'Custom Color', hex: '#C86237', image: editingProduct.image },
                          ];
                          setEditingProduct({ ...editingProduct, colors: nextColors });
                        }}
                        style={{
                          background: 'none',
                          border: '1px solid var(--color-terracotta)',
                          color: 'var(--color-terracotta-light)',
                          padding: '0.25rem 0.6rem',
                          borderRadius: 'var(--radius-xs)',
                          fontSize: '0.68rem',
                          cursor: 'pointer',
                          fontWeight: 700,
                        }}
                      >
                        + Add Colorway
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                      {editingProduct.colors.map((col, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '40px 1.5fr 1fr 2fr 30px',
                            gap: '0.6rem',
                            alignItems: 'center',
                          }}
                        >
                          <input
                            type="color"
                            value={col.hex}
                            onChange={(e) => {
                              const updated = [...editingProduct.colors];
                              updated[idx].hex = e.target.value;
                              setEditingProduct({ ...editingProduct, colors: updated });
                            }}
                            style={{
                              width: '36px',
                              height: '36px',
                              border: 'none',
                              padding: 0,
                              borderRadius: 'var(--radius-xs)',
                              cursor: 'pointer',
                              backgroundColor: 'transparent',
                            }}
                          />
                          <input
                            type="text"
                            placeholder="Color Name (e.g. Desert Sand)"
                            value={col.name}
                            onChange={(e) => {
                              const updated = [...editingProduct.colors];
                              updated[idx].name = e.target.value;
                              setEditingProduct({ ...editingProduct, colors: updated });
                            }}
                            style={fieldInputStyle}
                          />
                          <input
                            type="text"
                            placeholder="Hex Code"
                            value={col.hex}
                            onChange={(e) => {
                              const updated = [...editingProduct.colors];
                              updated[idx].hex = e.target.value;
                              setEditingProduct({ ...editingProduct, colors: updated });
                            }}
                            style={fieldInputStyle}
                          />
                          <input
                            type="text"
                            placeholder="Variant Image URL (Optional)"
                            value={col.image || ''}
                            onChange={(e) => {
                              const updated = [...editingProduct.colors];
                              updated[idx].image = e.target.value;
                              setEditingProduct({ ...editingProduct, colors: updated });
                            }}
                            style={fieldInputStyle}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = editingProduct.colors.filter((_, i) => i !== idx);
                              setEditingProduct({ ...editingProduct, colors: updated });
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#EF4444',
                              cursor: 'pointer',
                            }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                      type="submit"
                      disabled={productActionLoading}
                      className="btn-primary"
                      style={{ padding: '0.8rem 2rem' }}
                    >
                      <Save size={15} />
                      <span>{productActionLoading ? 'SAVING...' : 'SAVE PRODUCT & PERSIST'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: WALLPAPER & HERO AESTHETIC */}
          {activeTab === 'wallpaper' && (
            <div style={{ maxWidth: '820px' }}>
              <div style={{ marginBottom: '1.8rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', textTransform: 'uppercase', fontWeight: 800, marginBottom: '0.4rem' }}>
                  Storefront Wallpaper & Hero Aesthetic
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                  Change the full-bleed campaign background wallpaper for this client or pick from curated architectural presets.
                </p>
              </div>

              {/* Wallpaper Presets Grid */}
              <div style={{ marginBottom: '2rem' }}>
                <label style={fieldLabelStyle}>Curated Wallpaper Presets</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginTop: '0.6rem' }}>
                  {WALLPAPER_PRESETS.map((preset) => {
                    const isSelected = settingsForm.heroWallpaper === preset.url;
                    return (
                      <div
                        key={preset.id}
                        onClick={() => {
                          setSettingsForm({
                            ...settingsForm,
                            heroWallpaper: preset.url,
                            heroWallpaperPreset: preset.id,
                            accentColor: preset.accent,
                          });
                        }}
                        style={{
                          backgroundColor: '#16181D',
                          borderRadius: 'var(--radius-xs)',
                          border: isSelected ? '2px solid var(--color-terracotta)' : '1px solid rgba(255, 255, 255, 0.1)',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          boxShadow: isSelected ? '0 0 16px rgba(200, 98, 55, 0.35)' : 'none',
                        }}
                      >
                        <div style={{ height: '90px', backgroundImage: `url(${preset.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                        <div style={{ padding: '0.8rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isSelected ? '#FFFFFF' : 'var(--color-text-secondary)', display: 'block' }}>
                            {preset.name}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Custom Image URL */}
              <div style={{ marginBottom: '1.6rem' }}>
                <label style={fieldLabelStyle}>Or Custom Hero Wallpaper URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... or /assets/custom_hero.jpg"
                  value={settingsForm.heroWallpaper}
                  onChange={(e) => setSettingsForm({ ...settingsForm, heroWallpaper: e.target.value })}
                  style={fieldInputStyle}
                />
              </div>

              {/* Editable Hero Texts */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '2rem' }}>
                <div>
                  <label style={fieldLabelStyle}>Hero Campaign Eyebrow Badge</label>
                  <input
                    type="text"
                    value={settingsForm.heroBadge}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroBadge: e.target.value })}
                    style={fieldInputStyle}
                  />
                </div>

                <div>
                  <label style={fieldLabelStyle}>Hero Headline</label>
                  <input
                    type="text"
                    value={settingsForm.heroHeadline}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroHeadline: e.target.value })}
                    style={fieldInputStyle}
                  />
                </div>

                <div>
                  <label style={fieldLabelStyle}>Hero Subtitle Narrative</label>
                  <textarea
                    rows={3}
                    value={settingsForm.heroSubtitle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroSubtitle: e.target.value })}
                    style={{ ...fieldInputStyle, resize: 'vertical' }}
                  />
                </div>
              </div>

              {saveStatus && (
                <div style={{ padding: '0.8rem 1rem', marginBottom: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', fontSize: '0.82rem', borderRadius: 'var(--radius-xs)' }}>
                  {saveStatus}
                </div>
              )}

              <button onClick={handleSaveStoreSettings} className="btn-primary" style={{ padding: '0.8rem 2rem' }}>
                <Save size={15} />
                <span>SAVE WALLPAPER & HERO SETTINGS</span>
              </button>
            </div>
          )}

          {/* TAB 4: STORE DETAILS */}
          {activeTab === 'details' && (
            <div style={{ maxWidth: '820px' }}>
              <div style={{ marginBottom: '1.8rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', textTransform: 'uppercase', fontWeight: 800, marginBottom: '0.4rem' }}>
                  Store Branding & Details
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                  Customize the brand name, announcement bar ticker, shipping thresholds, and concierge contact for client handoff.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={fieldLabelStyle}>Brand / Store Name</label>
                    <input
                      type="text"
                      value={settingsForm.storeName}
                      onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                      style={fieldInputStyle}
                    />
                  </div>
                  <div>
                    <label style={fieldLabelStyle}>Tagline / Sub-Brand</label>
                    <input
                      type="text"
                      value={settingsForm.storeTagline}
                      onChange={(e) => setSettingsForm({ ...settingsForm, storeTagline: e.target.value })}
                      style={fieldInputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label style={fieldLabelStyle}>Top Announcement Bar Ticker</label>
                  <input
                    type="text"
                    value={settingsForm.announcementText}
                    onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                    style={fieldInputStyle}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={fieldLabelStyle}>Free Shipping Threshold ($ USD)</label>
                    <input
                      type="number"
                      value={settingsForm.freeShippingThreshold}
                      onChange={(e) => setSettingsForm({ ...settingsForm, freeShippingThreshold: parseFloat(e.target.value) || 0 })}
                      style={fieldInputStyle}
                    />
                  </div>
                  <div>
                    <label style={fieldLabelStyle}>Concierge Support Email</label>
                    <input
                      type="email"
                      value={settingsForm.supportEmail}
                      onChange={(e) => setSettingsForm({ ...settingsForm, supportEmail: e.target.value })}
                      style={fieldInputStyle}
                    />
                  </div>
                </div>
              </div>

              {saveStatus && (
                <div style={{ padding: '0.8rem 1rem', marginBottom: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', fontSize: '0.82rem', borderRadius: 'var(--radius-xs)' }}>
                  {saveStatus}
                </div>
              )}

              <button onClick={handleSaveStoreSettings} className="btn-primary" style={{ padding: '0.8rem 2rem' }}>
                <Save size={15} />
                <span>SAVE STORE DETAILS</span>
              </button>
            </div>
          )}

          {/* TAB 5: PAYMENT OPTIONS */}
          {activeTab === 'payment' && (
            <div style={{ maxWidth: '820px' }}>
              <div style={{ marginBottom: '1.8rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', textTransform: 'uppercase', fontWeight: 800, marginBottom: '0.4rem' }}>
                  Payment Options & Implementation Guidance
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                  Configure online payment gateways and low-cost checkout methods.
                </p>
              </div>

              {/* User Question Special Advisory Callout */}
              <div
                style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '1.4rem',
                  marginBottom: '2rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                  <HelpCircle size={18} color="#10B981" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Recommended Low-Cost, High-Utility Payment Solution
                  </span>
                </div>
                <div style={{ color: 'var(--color-sand)', fontSize: '0.82rem', lineHeight: 1.6 }}>
                  <p style={{ marginBottom: '0.6rem' }}>
                    <strong>1. Stripe (Pay-As-You-Go): Best overall.</strong> Zero monthly fee ($0/month), zero setup fee.
                    You only pay a standard 2.9% + $0.30 per successful customer transaction. It immediately provides
                    Apple Pay, Google Pay, Visa, Mastercard, and American Express.
                  </p>
                  <p style={{ marginBottom: '0.6rem' }}>
                    <strong>2. Cash on Delivery (COD) / Direct Bank Wire: 100% Free ($0 Cost, 0% Fee).</strong>
                    Essential for boutique brands or local clientele who prefer paying on courier delivery or wiring directly.
                  </p>
                  <p>
                    <strong>3. PayPal Standard:</strong> Free to set up ($0 monthly fee), familiar to international shoppers.
                  </p>
                </div>
              </div>

              {/* Payment Toggles */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                {/* Stripe Config */}
                <div style={paymentCardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <Lock size={16} color="#FFA578" />
                      <strong style={{ color: '#FFFFFF', fontSize: '0.9rem' }}>Stripe Checkout & Card Gateway</strong>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={settingsForm.payment.stripeEnabled}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            payment: { ...settingsForm.payment, stripeEnabled: e.target.checked },
                          })
                        }
                      />
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-sand)' }}>Enabled</span>
                    </label>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={fieldLabelStyle}>Stripe Publishable Key</label>
                      <input
                        type="text"
                        placeholder="pk_live_... or pk_test_..."
                        value={settingsForm.payment.stripePublishableKey}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            payment: { ...settingsForm.payment, stripePublishableKey: e.target.value },
                          })
                        }
                        style={fieldInputStyle}
                      />
                    </div>
                    <div>
                      <label style={fieldLabelStyle}>Mode</label>
                      <select
                        value={settingsForm.payment.stripeTestMode ? 'test' : 'live'}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            payment: { ...settingsForm.payment, stripeTestMode: e.target.value === 'test' },
                          })
                        }
                        style={fieldInputStyle}
                      >
                        <option value="test">Test Sandbox Mode</option>
                        <option value="live">Live Production</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Cash on Delivery / Wire Config */}
                <div style={paymentCardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <Package size={16} color="#10B981" />
                      <strong style={{ color: '#FFFFFF', fontSize: '0.9rem' }}>Cash on Delivery / Direct Bank Transfer ($0 Fees)</strong>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={settingsForm.payment.codEnabled}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            payment: { ...settingsForm.payment, codEnabled: e.target.checked },
                          })
                        }
                      />
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-sand)' }}>Enabled</span>
                    </label>
                  </div>
                  <div>
                    <label style={fieldLabelStyle}>Instructions for Customer on Checkout</label>
                    <input
                      type="text"
                      value={settingsForm.payment.codInstructions}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          payment: { ...settingsForm.payment, codInstructions: e.target.value },
                        })
                      }
                      style={fieldInputStyle}
                    />
                  </div>
                </div>

                {/* PayPal Config */}
                <div style={paymentCardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <CreditCard size={16} color="#3B82F6" />
                      <strong style={{ color: '#FFFFFF', fontSize: '0.9rem' }}>PayPal Express ($0 Monthly Fee)</strong>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={settingsForm.payment.paypalEnabled}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            payment: { ...settingsForm.payment, paypalEnabled: e.target.checked },
                          })
                        }
                      />
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-sand)' }}>Enabled</span>
                    </label>
                  </div>
                  <div>
                    <label style={fieldLabelStyle}>PayPal Client ID</label>
                    <input
                      type="text"
                      placeholder="sb_client_id_..."
                      value={settingsForm.payment.paypalClientId}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          payment: { ...settingsForm.payment, paypalClientId: e.target.value },
                        })
                      }
                      style={fieldInputStyle}
                    />
                  </div>
                </div>
              </div>

              {saveStatus && (
                <div style={{ padding: '0.8rem 1rem', marginBottom: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', fontSize: '0.82rem', borderRadius: 'var(--radius-xs)' }}>
                  {saveStatus}
                </div>
              )}

              <button onClick={handleSaveStoreSettings} className="btn-primary" style={{ padding: '0.8rem 2rem' }}>
                <Save size={15} />
                <span>SAVE PAYMENT GATEWAY CONFIGURATION</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const tabButtonStyle = (isActive: boolean): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.9rem 1.4rem',
  background: 'none',
  border: 'none',
  borderBottom: isActive ? '2px solid var(--color-terracotta)' : '2px solid transparent',
  color: isActive ? '#FFFFFF' : 'var(--color-text-secondary)',
  fontSize: '0.76rem',
  fontFamily: 'var(--font-display)',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'all 0.2s',
});

const fieldLabelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.7rem',
  fontWeight: 700,
  fontFamily: 'var(--font-display)',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'var(--color-text-secondary)',
  marginBottom: '0.4rem',
};

const fieldInputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  borderRadius: 'var(--radius-xs)',
  padding: '0.75rem 0.9rem',
  color: '#FFFFFF',
  fontSize: '0.84rem',
  outline: 'none',
  fontFamily: 'var(--font-sans)',
};

const tableThStyle: React.CSSProperties = {
  padding: '0.85rem 1rem',
  fontSize: '0.68rem',
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'var(--color-text-muted)',
};

const tableTdStyle: React.CSSProperties = {
  padding: '0.85rem 1rem',
  verticalAlign: 'middle',
};

const paymentCardStyle: React.CSSProperties = {
  backgroundColor: '#14161A',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: 'var(--radius-xs)',
  padding: '1.2rem',
};

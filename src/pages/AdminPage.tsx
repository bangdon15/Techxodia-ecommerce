import React, { useState } from 'react';
import {
  ArrowLeft,
  Database,
  Package,
  Image as ImageIcon,
  Sliders,
  CreditCard,
  Plus,
  Trash2,
  RefreshCw,
  Sparkles,
  Save,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Lock,
  Layers,
  ExternalLink,
  Store,
} from 'lucide-react';
import { Product, StoreSettings } from '../types';
import { WALLPAPER_PRESETS, saveStoreSettings } from '../lib/settings';
import {
  getSupabaseClient,
  saveSupabaseConfig,
  getSupabaseConfig,
  seedSupabaseDatabase,
  upsertProduct,
  deleteProduct,
} from '../lib/supabase';
import confetti from 'canvas-confetti';

interface AdminPageProps {
  onBackToStore: () => void;
  products: Product[];
  onRefreshCatalog: () => void;
  storeSettings: StoreSettings;
  onUpdateSettings: (newSettings: StoreSettings) => void;
  supabaseSource: 'supabase' | 'fallback';
}

type AdminTab = 'database' | 'products' | 'wallpaper' | 'details' | 'payment';

export const AdminPage: React.FC<AdminPageProps> = ({
  onBackToStore,
  products,
  onRefreshCatalog,
  storeSettings,
  onUpdateSettings,
  supabaseSource,
}) => {
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

  // Store Settings State
  const [settingsForm, setSettingsForm] = useState<StoreSettings>({ ...storeSettings });
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Products CRUD States
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [productActionLoading, setProductActionLoading] = useState(false);
  const [productMessage, setProductMessage] = useState<string | null>(null);
  const [productSearch, setProductSearch] = useState('');

  // Test Supabase Connection
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
      const { error } = await client.from('products').select('count', { count: 'exact', head: true });
      if (error && error.code !== 'PGRST116') {
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
          message: 'Supabase connection verified successfully! Live products table is active.',
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
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });
      } catch {
        // ignore
      }
    }
  };

  // Save Store Settings
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
      name: 'NEW VESSEL DROP',
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
        { name: 'Dune Sandstone', hex: '#D8CEBC', image: '/assets/product_jug_sandstone.jpg' },
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

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0A0B0D',
        color: '#F8F7F4',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Top Admin Navigation Bar */}
      <header
        style={{
          backgroundColor: '#121418',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '0.9rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <button
            onClick={onBackToStore}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#FFFFFF',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-xs)',
              fontSize: '0.75rem',
              fontWeight: 700,
              fontFamily: 'var(--font-display)',
              letterSpacing: '0.08em',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <ArrowLeft size={15} />
            <span>RETURN TO STOREFRONT</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                backgroundColor: 'rgba(200, 98, 55, 0.2)',
                border: '1px solid var(--color-terracotta)',
                borderRadius: 'var(--radius-xs)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sliders size={16} color="#FFA578" />
            </div>
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 900,
                  fontSize: '1rem',
                  letterSpacing: '0.12em',
                  color: '#FFFFFF',
                  textTransform: 'uppercase',
                }}
              >
                TECHXODIA // CONTROL CONSOLE
              </span>
            </div>
          </div>
        </div>

        {/* Status Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: supabaseSource === 'supabase' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
              border: supabaseSource === 'supabase' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              color: supabaseSource === 'supabase' ? '#10B981' : '#F59E0B',
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: supabaseSource === 'supabase' ? '#10B981' : '#F59E0B',
              }}
            />
            <span>{supabaseSource === 'supabase' ? 'SUPABASE CONNECTED' : 'OFFLINE / DEMO MODE'}</span>
          </div>

          <button
            onClick={() => window.open('/', '_blank')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.72rem',
            }}
            title="Open Storefront in New Window"
          >
            <Store size={14} />
            <ExternalLink size={12} />
          </button>
        </div>
      </header>

      {/* Main Admin Body */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Left Side Navigation Menu */}
        <aside
          style={{
            width: '260px',
            backgroundColor: '#0F1014',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '1.5rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          <span
            style={{
              fontSize: '0.65rem',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              letterSpacing: '0.14em',
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
              padding: '0 0.8rem 0.5rem 0.8rem',
            }}
          >
            Configuration Modules
          </span>

          <button
            onClick={() => {
              setActiveTab('database');
              setEditingProduct(null);
            }}
            style={navBtnStyle(activeTab === 'database')}
          >
            <Database size={16} />
            <span>1. Supabase Database</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('products');
              setEditingProduct(null);
            }}
            style={navBtnStyle(activeTab === 'products')}
          >
            <Package size={16} />
            <span>2. Products ({products.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('wallpaper');
              setEditingProduct(null);
            }}
            style={navBtnStyle(activeTab === 'wallpaper')}
          >
            <ImageIcon size={16} />
            <span>3. Wallpaper & Hero</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('details');
              setEditingProduct(null);
            }}
            style={navBtnStyle(activeTab === 'details')}
          >
            <Layers size={16} />
            <span>4. Store Details</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('payment');
              setEditingProduct(null);
            }}
            style={navBtnStyle(activeTab === 'payment')}
          >
            <CreditCard size={16} />
            <span>5. Payment Options</span>
          </button>

          <div
            style={{
              marginTop: 'auto',
              padding: '1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>
              Quick Hint:
            </span>
            <p style={{ fontSize: '0.72rem', color: 'var(--color-sand)', lineHeight: 1.4 }}>
              This page is private. Customers visiting the storefront will not see admin links or setup buttons.
            </p>
          </div>
        </aside>

        {/* Content Panel */}
        <main style={{ flex: 1, padding: '2.5rem', overflowY: 'auto', maxWidth: '1100px' }}>
          {/* TAB 1: DATABASE */}
          {activeTab === 'database' && (
            <div>
              <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  Supabase Cloud Database Connection
                </h1>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem' }}>
                  Configure your free Supabase PostgreSQL instance. All storefront products, user orders, and drop subscribers synchronize automatically.
                </p>
              </div>

              <div
                style={{
                  backgroundColor: '#14161A',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '1.8rem',
                  marginBottom: '2rem',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
                  <div>
                    <label style={fieldLabelStyle}>Supabase Project URL</label>
                    <input
                      type="url"
                      placeholder="https://xyzcompany.supabase.co"
                      value={supabaseUrl}
                      onChange={(e) => setSupabaseUrl(e.target.value)}
                      style={fieldInputStyle}
                    />
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '0.3rem', display: 'block' }}>
                      Found under Settings &gt; API in your Supabase Dashboard.
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
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '0.3rem', display: 'block' }}>
                      The anonymous public API key for safe frontend client access.
                    </span>
                  </div>

                  {dbTestStatus.tested && (
                    <div
                      style={{
                        padding: '1rem',
                        borderRadius: 'var(--radius-xs)',
                        backgroundColor: dbTestStatus.success ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                        border: dbTestStatus.success ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                        color: dbTestStatus.success ? '#10B981' : '#EF4444',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                      }}
                    >
                      {dbTestStatus.success ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                      <span>{dbTestStatus.message}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    <button
                      onClick={handleTestConnection}
                      className="btn-secondary"
                      style={{ minHeight: '44px', padding: '0.75rem 1.6rem' }}
                    >
                      <RefreshCw size={15} />
                      <span>TEST LIVE CONNECTION</span>
                    </button>

                    <button
                      onClick={handleSeedDatabase}
                      disabled={isSeeding}
                      className="btn-primary"
                      style={{ minHeight: '44px', padding: '0.75rem 1.8rem' }}
                    >
                      <Sparkles size={15} />
                      <span>{isSeeding ? 'SEEDING DATABASE...' : 'SEED SUPABASE WITH INITIAL CATALOG'}</span>
                    </button>
                  </div>

                  {seedResult && (
                    <div
                      style={{
                        padding: '0.9rem 1.2rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        fontSize: '0.82rem',
                        color: 'var(--color-sand)',
                        borderRadius: 'var(--radius-xs)',
                      }}
                    >
                      {seedResult}
                    </div>
                  )}
                </div>
              </div>

              {/* SQL Schema Reference */}
              <div
                style={{
                  backgroundColor: '#0F1014',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Supabase Schema SQL Reference
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-terracotta)' }}>schema.sql bundled</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                  Copy and paste this into your Supabase Dashboard SQL Editor if tables are not created yet:
                </p>
                <pre
                  style={{
                    backgroundColor: '#070809',
                    padding: '1rem',
                    borderRadius: 'var(--radius-xs)',
                    fontSize: '0.72rem',
                    color: '#A39B8B',
                    overflowX: 'auto',
                    fontFamily: 'monospace',
                    lineHeight: 1.45,
                  }}
                >{`CREATE TABLE IF NOT EXISTS public.products (
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

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow All" ON public.products FOR ALL USING (true);`}</pre>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS CRUD */}
          {activeTab === 'products' && (
            <div>
              {!editingProduct ? (
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1.8rem',
                      flexWrap: 'wrap',
                      gap: '1rem',
                    }}
                  >
                    <div>
                      <h1 style={{ fontSize: '1.6rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                        Storefront Product Catalog ({products.length})
                      </h1>
                      <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem' }}>
                        Modify prices, stock, descriptions, and colorway images. Changes take effect on the storefront instantly.
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        style={{ ...fieldInputStyle, width: '220px', padding: '0.6rem 0.8rem' }}
                      />
                      <button onClick={handleStartNewProduct} className="btn-primary" style={{ padding: '0.65rem 1.4rem' }}>
                        <Plus size={16} />
                        <span>ADD NEW PRODUCT</span>
                      </button>
                    </div>
                  </div>

                  {productMessage && (
                    <div
                      style={{
                        padding: '0.9rem 1.2rem',
                        marginBottom: '1.5rem',
                        backgroundColor: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        color: '#10B981',
                        fontSize: '0.85rem',
                        borderRadius: 'var(--radius-xs)',
                      }}
                    >
                      {productMessage}
                    </div>
                  )}

                  {/* Table */}
                  <div
                    style={{
                      backgroundColor: '#121418',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: 'var(--radius-xs)',
                      overflowX: 'auto',
                    }}
                  >
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#0B0C0E', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
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
                        {filteredProducts.map((p) => (
                          <tr key={p.id || p.slug} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                            <td style={tableTdStyle}>
                              <img
                                src={p.image}
                                alt={p.name}
                                style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: 'var(--radius-xs)', backgroundColor: '#1A1C22' }}
                              />
                            </td>
                            <td style={tableTdStyle}>
                              <strong style={{ color: '#FFFFFF', display: 'block' }}>{p.name}</strong>
                              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{p.subtitle}</span>
                            </td>
                            <td style={tableTdStyle}>
                              <span style={{ color: 'var(--color-sand)', fontSize: '0.78rem' }}>{p.category}</span>
                            </td>
                            <td style={tableTdStyle}>
                              <span style={{ fontWeight: 800, color: '#FFFFFF' }}>${p.price}</span>
                              {p.original_price && (
                                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginLeft: '4px', textDecoration: 'line-through' }}>
                                  ${p.original_price}
                                </span>
                              )}
                            </td>
                            <td style={tableTdStyle}>
                              <span
                                style={{
                                  padding: '0.2rem 0.55rem',
                                  borderRadius: 'var(--radius-xs)',
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  backgroundColor: p.stock > 10 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                  color: p.stock > 10 ? '#10B981' : '#EF4444',
                                }}
                              >
                                {p.stock} units
                              </span>
                            </td>
                            <td style={tableTdStyle}>
                              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                {p.colors.map((c, idx) => (
                                  <span
                                    key={idx}
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
                                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginLeft: '4px' }}>
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
                                    border: '1px solid rgba(255, 255, 255, 0.14)',
                                    color: '#FFFFFF',
                                    padding: '0.4rem 0.85rem',
                                    borderRadius: 'var(--radius-xs)',
                                    fontSize: '0.74rem',
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
                                    padding: '0.4rem 0.65rem',
                                    borderRadius: 'var(--radius-xs)',
                                    cursor: 'pointer',
                                  }}
                                  title="Delete Product"
                                >
                                  <Trash2 size={14} />
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
                /* Edit Product Form */
                <form onSubmit={handleSaveProduct} style={{ maxWidth: '850px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.8rem' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 900, textTransform: 'uppercase' }}>
                      {isCreatingProduct ? 'Create New Archival Product' : `Edit: ${editingProduct.name}`}
                    </h2>
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      style={{
                        background: 'none',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: 'var(--color-text-secondary)',
                        padding: '0.5rem 1rem',
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        borderRadius: 'var(--radius-xs)',
                      }}
                    >
                      Cancel
                    </button>
                  </div>

                  {productMessage && (
                    <div style={{ padding: '0.8rem 1rem', marginBottom: '1.2rem', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', fontSize: '0.82rem', borderRadius: 'var(--radius-xs)' }}>
                      {productMessage}
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label style={fieldLabelStyle}>Product Title</label>
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
                      <label style={fieldLabelStyle}>Price ($ USD)</label>
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
                      <label style={fieldLabelStyle}>Original Retail ($ USD)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={editingProduct.original_price || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, original_price: parseFloat(e.target.value) || null })}
                        style={fieldInputStyle}
                      />
                    </div>
                    <div>
                      <label style={fieldLabelStyle}>Available Stock</label>
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
                      <label style={fieldLabelStyle}>Subtitle</label>
                      <input
                        type="text"
                        value={editingProduct.subtitle}
                        onChange={(e) => setEditingProduct({ ...editingProduct, subtitle: e.target.value })}
                        style={fieldInputStyle}
                      />
                    </div>
                    <div>
                      <label style={fieldLabelStyle}>Capacity</label>
                      <input
                        type="text"
                        value={editingProduct.capacity}
                        onChange={(e) => setEditingProduct({ ...editingProduct, capacity: e.target.value })}
                        style={fieldInputStyle}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={fieldLabelStyle}>Primary Photo Asset Path or URL</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.image}
                      onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                      style={fieldInputStyle}
                    />
                  </div>

                  <div style={{ marginBottom: '1.2rem' }}>
                    <label style={fieldLabelStyle}>Description</label>
                    <textarea
                      rows={3}
                      value={editingProduct.description}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      style={{ ...fieldInputStyle, resize: 'vertical' }}
                    />
                  </div>

                  {/* Color Swatches Editor */}
                  <div
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      padding: '1.2rem',
                      borderRadius: 'var(--radius-xs)',
                      marginBottom: '1.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase' }}>
                        Color Variations & Dedicated Photos
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const next = [
                            ...editingProduct.colors,
                            { name: 'New Color', hex: '#C86237', image: editingProduct.image },
                          ];
                          setEditingProduct({ ...editingProduct, colors: next });
                        }}
                        style={{
                          background: 'none',
                          border: '1px solid var(--color-terracotta)',
                          color: 'var(--color-terracotta-light)',
                          padding: '0.3rem 0.7rem',
                          borderRadius: 'var(--radius-xs)',
                          fontSize: '0.72rem',
                          cursor: 'pointer',
                          fontWeight: 700,
                        }}
                      >
                        + Add Colorway
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                      {editingProduct.colors.map((c, idx) => (
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
                            value={c.hex}
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
                            placeholder="Color Name"
                            value={c.name}
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
                            value={c.hex}
                            onChange={(e) => {
                              const updated = [...editingProduct.colors];
                              updated[idx].hex = e.target.value;
                              setEditingProduct({ ...editingProduct, colors: updated });
                            }}
                            style={fieldInputStyle}
                          />
                          <input
                            type="text"
                            placeholder="Variant Image URL"
                            value={c.image || ''}
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
                            style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button type="submit" disabled={productActionLoading} className="btn-primary" style={{ padding: '0.85rem 2.2rem' }}>
                    <Save size={16} />
                    <span>{productActionLoading ? 'SAVING...' : 'SAVE PRODUCT & PERSIST'}</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: WALLPAPER & HERO */}
          {activeTab === 'wallpaper' && (
            <div style={{ maxWidth: '850px' }}>
              <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  Wallpaper & Visual Aesthetic
                </h1>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem' }}>
                  Select a wallpaper preset or supply your own custom photograph to change the full-bleed campaign background.
                </p>
              </div>

              {/* Wallpaper Presets */}
              <div style={{ marginBottom: '2rem' }}>
                <label style={fieldLabelStyle}>Curated Architectural Wallpaper Presets</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginTop: '0.6rem' }}>
                  {WALLPAPER_PRESETS.map((p) => {
                    const isSelected = settingsForm.heroWallpaper === p.url;
                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          setSettingsForm({
                            ...settingsForm,
                            heroWallpaper: p.url,
                            heroWallpaperPreset: p.id,
                            accentColor: p.accent,
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
                        <div style={{ height: '100px', backgroundImage: `url(${p.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                        <div style={{ padding: '0.8rem' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: isSelected ? '#FFFFFF' : 'var(--color-text-secondary)', display: 'block' }}>
                            {p.name}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ marginBottom: '1.8rem' }}>
                <label style={fieldLabelStyle}>Custom Wallpaper Photo URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={settingsForm.heroWallpaper}
                  onChange={(e) => setSettingsForm({ ...settingsForm, heroWallpaper: e.target.value })}
                  style={fieldInputStyle}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '2rem' }}>
                <div>
                  <label style={fieldLabelStyle}>Hero Campaign Badge</label>
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

              <button onClick={handleSaveStoreSettings} className="btn-primary" style={{ padding: '0.85rem 2.2rem' }}>
                <Save size={16} />
                <span>SAVE WALLPAPER & HERO AESTHETICS</span>
              </button>
            </div>
          )}

          {/* TAB 4: STORE DETAILS */}
          {activeTab === 'details' && (
            <div style={{ maxWidth: '850px' }}>
              <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  Store Branding & Details
                </h1>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem' }}>
                  Configure client brand names, announcement tickers, free shipping thresholds, and concierge contact emails.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem', marginBottom: '2rem' }}>
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
                    <label style={fieldLabelStyle}>Series / Tagline</label>
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
                    <label style={fieldLabelStyle}>Free Shipping Qualification Threshold ($ USD)</label>
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

              <button onClick={handleSaveStoreSettings} className="btn-primary" style={{ padding: '0.85rem 2.2rem' }}>
                <Save size={16} />
                <span>SAVE STORE DETAILS</span>
              </button>
            </div>
          )}

          {/* TAB 5: PAYMENT OPTIONS */}
          {activeTab === 'payment' && (
            <div style={{ maxWidth: '850px' }}>
              <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  Online Payment Gateways & Strategy
                </h1>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem' }}>
                  Configure online payment checkout options for this e-commerce deployment.
                </p>
              </div>

              {/* Expert Advisory Guidance */}
              <div
                style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '1.6rem',
                  marginBottom: '2rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
                  <HelpCircle size={20} color="#10B981" />
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase' }}>
                    Recommended Low-Cost, High-Utility Payment Solution
                  </h3>
                </div>
                <div style={{ color: 'var(--color-sand)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                  <p style={{ marginBottom: '0.8rem' }}>
                    <strong>1. Stripe (Pay-As-You-Go): Highly Recommended.</strong> Zero monthly fee ($0/mo) and zero setup fees.
                    You only pay the standard 2.9% + $0.30 fee per successful sale. Instantly activates Apple Pay, Google Pay, Visa, Mastercard, and Amex without needing a traditional merchant account.
                  </p>
                  <p style={{ marginBottom: '0.8rem' }}>
                    <strong>2. Cash on Delivery (COD) / Direct Bank Wire ($0 Fees, 100% Free):</strong>
                    Zero transaction fee, zero setup. Highly effective for local courier distribution or high-ticket collector pieces.
                  </p>
                  <p>
                    <strong>3. PayPal Standard ($0 Monthly Fee):</strong>
                    Recognized worldwide and provides buyers with 1-click checkout using existing balances.
                  </p>
                </div>
              </div>

              {/* Toggles and inputs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                {/* Stripe */}
                <div style={paymentCardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <Lock size={16} color="#FFA578" />
                      <strong style={{ color: '#FFFFFF', fontSize: '0.92rem' }}>Stripe Gateway</strong>
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
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-sand)' }}>Enabled</span>
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

                {/* COD */}
                <div style={paymentCardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <Package size={16} color="#10B981" />
                      <strong style={{ color: '#FFFFFF', fontSize: '0.92rem' }}>Cash on Delivery / Direct Bank Transfer ($0 Cost)</strong>
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
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-sand)' }}>Enabled</span>
                    </label>
                  </div>
                  <div>
                    <label style={fieldLabelStyle}>Checkout Instructions for Client</label>
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

                {/* PayPal */}
                <div style={paymentCardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <CreditCard size={16} color="#3B82F6" />
                      <strong style={{ color: '#FFFFFF', fontSize: '0.92rem' }}>PayPal Express ($0 Monthly Fee)</strong>
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
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-sand)' }}>Enabled</span>
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

              <button onClick={handleSaveStoreSettings} className="btn-primary" style={{ padding: '0.85rem 2.2rem' }}>
                <Save size={16} />
                <span>SAVE PAYMENT CONFIGURATION</span>
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const navBtnStyle = (isActive: boolean): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.65rem',
  padding: '0.75rem 0.9rem',
  borderRadius: 'var(--radius-xs)',
  backgroundColor: isActive ? 'rgba(200, 98, 55, 0.16)' : 'transparent',
  border: isActive ? '1px solid rgba(200, 98, 55, 0.4)' : '1px solid transparent',
  color: isActive ? '#FFA578' : 'var(--color-text-secondary)',
  fontSize: '0.78rem',
  fontFamily: 'var(--font-display)',
  fontWeight: 700,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  cursor: 'pointer',
  textAlign: 'left',
  width: '100%',
  transition: 'all 0.15s ease',
});

const fieldLabelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.72rem',
  fontWeight: 700,
  fontFamily: 'var(--font-display)',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--color-text-secondary)',
  marginBottom: '0.4rem',
};

const fieldInputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  borderRadius: 'var(--radius-xs)',
  padding: '0.8rem 0.95rem',
  color: '#FFFFFF',
  fontSize: '0.86rem',
  outline: 'none',
  fontFamily: 'var(--font-sans)',
};

const tableThStyle: React.CSSProperties = {
  padding: '0.9rem 1.1rem',
  fontSize: '0.7rem',
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'var(--color-text-muted)',
};

const tableTdStyle: React.CSSProperties = {
  padding: '0.9rem 1.1rem',
  verticalAlign: 'middle',
};

const paymentCardStyle: React.CSSProperties = {
  backgroundColor: '#14161A',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: 'var(--radius-xs)',
  padding: '1.4rem',
};

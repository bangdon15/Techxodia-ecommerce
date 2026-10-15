import React, { useState, useEffect } from 'react';
import { Product, ProductColor, CartItem, CurrencyCode, StoreSettings } from './types';
import { fetchProducts } from './lib/supabase';
import { getStoreSettings } from './lib/settings';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProductGrid } from './components/ProductGrid';
import { StorySplit } from './components/StorySplit';
import { SpecsSection } from './components/SpecsSection';
import { LookbookSection } from './components/LookbookSection';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { SupabaseConnectModal } from './components/SupabaseConnectModal';
import { SearchModal } from './components/SearchModal';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { AdminPortal } from './components/AdminPortal';
import { MobileBottomNav } from './components/MobileBottomNav';
import confetti from 'canvas-confetti';

export function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [supabaseSource, setSupabaseSource] = useState<'supabase' | 'fallback'>('fallback');
  const [activeCurrency, setActiveCurrency] = useState<CurrencyCode>('USD');
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(getStoreSettings);

  // Cart State (Persisted in LocalStorage)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('techxodia_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals & Drawers State
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [supabaseModalOpen, setSupabaseModalOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [adminPortalOpen, setAdminPortalOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [quickViewColor, setQuickViewColor] = useState<ProductColor | null>(null);

  // Load products on mount
  const loadCatalog = async () => {
    setIsLoadingProducts(true);
    const result = await fetchProducts();
    setProducts(result.products);
    setSupabaseSource(result.source);
    setIsLoadingProducts(false);
  };

  useEffect(() => {
    loadCatalog();
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('techxodia_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Cart Actions
  const handleAddToCart = (
    product: Product,
    color: ProductColor,
    quantity: number = 1,
    customEngraving?: string
  ) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (i) =>
          i.product.id === product.id &&
          i.selectedColor.name === color.name &&
          i.customEngraving === customEngraving
      );

      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += quantity;
        return next;
      }

      return [
        ...prev,
        {
          product,
          selectedColor: color,
          quantity,
          customEngraving,
        },
      ];
    });

    // Auto-open cart drawer for immediate user feedback
    setCartOpen(true);
  };

  const handleUpdateQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(index);
      return;
    }
    setCart((prev) => {
      const next = [...prev];
      next[index].quantity = newQty;
      return next;
    });
  };

  const handleRemoveItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCheckoutOpen = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const handleOrderSuccess = () => {
    setCart([]);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const scrollToCollection = () => {
    const el = document.getElementById('collection');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToCraft = () => {
    const el = document.getElementById('craftsmanship');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Announcement Bar */}
      <AnnouncementBar customAnnouncement={storeSettings.announcementText} />

      {/* Main Sticky Architectural Navbar */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setCartOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenSupabaseModal={() => setSupabaseModalOpen(true)}
        onOpenAdmin={() => setAdminPortalOpen(true)}
        supabaseSource={supabaseSource}
        activeCurrency={activeCurrency}
        onCurrencyChange={setActiveCurrency}
        brandName={storeSettings.storeName}
        brandTagline={storeSettings.storeTagline}
      />

      {/* Main Page Layout */}
      <main style={{ flex: 1 }}>
        {/* Full-bleed Campaign Hero Banner */}
        <HeroSection
          onExploreClick={scrollToCollection}
          onCraftClick={scrollToCraft}
          storeSettings={storeSettings}
        />

        {/* Dynamic Product Grid connected with Supabase */}
        <ProductGrid
          products={products}
          currency={activeCurrency}
          onAddToCart={(product, color) => handleAddToCart(product, color, 1)}
          onQuickView={(product, color) => {
            setQuickViewProduct(product);
            setQuickViewColor(color || product.colors[0] || null);
          }}
          onRefreshProducts={loadCatalog}
          isLoading={isLoadingProducts}
          supabaseSource={supabaseSource}
        />

        {/* Editorial Craftsmanship & Material Story Split */}
        <StorySplit />

        {/* Technical Specification Matrix */}
        <SpecsSection />

        {/* Campaign Visual Lookbook */}
        <LookbookSection />

        {/* VIP Drop Registry & Newsletter (Supabase synced) */}
        <Newsletter />
      </main>

      {/* Luxury Footer */}
      <Footer />

      {/* Mobile Bottom Dock for Webview & Smartphone Experience */}
      <MobileBottomNav
        cartCount={totalCartCount}
        onOpenCart={() => setCartOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenAdmin={() => setAdminPortalOpen(true)}
        onScrollToCollection={scrollToCollection}
      />

      {/* Master Admin Portal Modal */}
      <AdminPortal
        isOpen={adminPortalOpen}
        onClose={() => setAdminPortalOpen(false)}
        products={products}
        onRefreshCatalog={loadCatalog}
        storeSettings={storeSettings}
        onUpdateSettings={setStoreSettings}
      />

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={quickViewProduct}
        initialColor={quickViewColor}
        currency={activeCurrency}
        onClose={() => {
          setQuickViewProduct(null);
          setQuickViewColor(null);
        }}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        currency={activeCurrency}
        onCheckout={handleCheckoutOpen}
      />

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={cart}
        currency={activeCurrency}
        onOrderSuccess={handleOrderSuccess}
        paymentSettings={storeSettings.payment}
        freeShippingThreshold={storeSettings.freeShippingThreshold}
      />

      <SupabaseConnectModal
        isOpen={supabaseModalOpen}
        onClose={() => setSupabaseModalOpen(false)}
        onRefreshApp={loadCatalog}
      />

      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        products={products}
        currency={activeCurrency}
        onSelectProduct={(product) => setQuickViewProduct(product)}
      />
    </div>
  );
}

export default App;

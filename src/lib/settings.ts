import { StoreSettings } from '../types';
import { getSupabaseClient } from './supabase';

export const WALLPAPER_PRESETS = [
  {
    id: 'desert_dusk',
    name: 'Desert Modernist Dusk (Default)',
    url: '/assets/hero_collab.jpg',
    accent: '#C86237',
  },
  {
    id: 'volcanic_stealth',
    name: 'Volcanic Obsidian Dark',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=2000&q=85',
    accent: '#E07A5F',
  },
  {
    id: 'nordic_concrete',
    name: 'Brutalist Architectural Concrete',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85',
    accent: '#D8CEBC',
  },
  {
    id: 'warm_travertine',
    name: 'Warm Travertine Minimal',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2000&q=85',
    accent: '#B34E26',
  },
];

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: 'TECHXODIA',
  storeTagline: 'SERIES 01 // ARCHIVE',
  heroWallpaper: '/assets/hero_collab.jpg',
  heroWallpaperPreset: 'desert_dusk',
  heroHeadline: 'DESIGNED FOR CALM IN THE CLAMOR.',
  heroSubtitle: 'Crafted at the intersection of quiet luxury and relentless thermal utility. Wrapped in baked desert terracotta ceramic and dual-barrier recycled stainless steel.',
  heroBadge: 'TECHXODIA × SIGNATURE ARCHIVE // LIMITED RUN 001',
  accentColor: '#C86237',
  announcementText: 'COMPLIMENTARY EXPRESS GLOBAL SHIPPING OVER $75 • LIMITED DROP 001',
  freeShippingThreshold: 75,
  supportEmail: 'concierge@techxodia.com',
  payment: {
    stripeEnabled: true,
    stripePublishableKey: 'pk_test_sample_51O9TechxodiaDemoKey',
    stripeTestMode: true,
    paypalEnabled: true,
    paypalClientId: 'sb_test_client_techxodia',
    codEnabled: true,
    codInstructions: 'Pay securely upon courier delivery or via direct manual bank transfer.',
    activeGateway: 'card_demo',
  },
};

export const getStoreSettings = (): StoreSettings => {
  if (typeof window === 'undefined') return DEFAULT_STORE_SETTINGS;
  try {
    const raw = localStorage.getItem('techxodia_store_settings');
    if (!raw) return DEFAULT_STORE_SETTINGS;
    return { ...DEFAULT_STORE_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STORE_SETTINGS;
  }
};

export const saveStoreSettings = async (settings: StoreSettings): Promise<{ success: boolean; message: string }> => {
  try {
    localStorage.setItem('techxodia_store_settings', JSON.stringify(settings));

    // Also attempt saving to Supabase if table exists
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase
          .from('store_settings')
          .upsert([{ id: 'default', ...settings, updated_at: new Date().toISOString() }], { onConflict: 'id' });
      } catch (e) {
        console.warn('Optional store_settings table not set in Supabase:', e);
      }
    }

    return { success: true, message: 'Settings persisted successfully!' };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, message: msg };
  }
};

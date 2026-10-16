import { StoreSettings } from '../types';
import { getSupabaseClient } from './supabase';

export const WALLPAPER_PRESETS = [
  {
    id: 'nature_scenery',
    name: 'Misty Alpine Architecture (Default)',
    url: '/assets/hero_nature_scenery.jpg',
    accent: '#000000',
  },
  {
    id: 'nordic_concrete',
    name: 'Brutalist Architectural Concrete',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85',
    accent: '#000000',
  },
  {
    id: 'warm_travertine',
    name: 'Warm Travertine Minimal',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2000&q=85',
    accent: '#000000',
  },
];

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: 'TECHXODIA',
  storeTagline: 'SERIES 01 // ARCHIVE',
  heroWallpaper: '/assets/hero_nature_scenery.jpg',
  heroWallpaperPreset: 'nature_scenery',
  heroHeadline: 'DESIGNED FOR CALM IN THE CLAMOR.',
  heroSubtitle: 'Crafted at the intersection of quiet luxury and relentless thermal utility. Wrapped in baked polar white ceramic and dual-barrier recycled stainless steel.',
  heroBadge: 'TECHXODIA × SIGNATURE ARCHIVE // POLAR WHITE DROP 001',
  accentColor: '#000000',
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
    const parsed = JSON.parse(raw);
    if (
      parsed.heroSubtitle?.toLowerCase().includes('desert terracotta') ||
      parsed.heroWallpaper === '/assets/hero_collab.jpg' ||
      parsed.heroWallpaper === '/assets/hero_white_luxury.jpg' ||
      !parsed.heroWallpaper
    ) {
      const upgraded = {
        ...DEFAULT_STORE_SETTINGS,
        ...parsed,
        heroWallpaper: '/assets/hero_nature_scenery.jpg',
        heroWallpaperPreset: 'nature_scenery',
        heroSubtitle: DEFAULT_STORE_SETTINGS.heroSubtitle,
        heroBadge: DEFAULT_STORE_SETTINGS.heroBadge,
      };
      localStorage.setItem('techxodia_store_settings', JSON.stringify(upgraded));
      return upgraded;
    }
    return { ...DEFAULT_STORE_SETTINGS, ...parsed };
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

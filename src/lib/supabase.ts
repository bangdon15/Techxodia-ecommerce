import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product, OrderRecord } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

// Read from Vite environment variables or localStorage (allows live UI config testing)
export const getStoredCredentials = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  const localUrl = typeof window !== 'undefined' ? localStorage.getItem('techxodia_supabase_url') || '' : '';
  const localKey = typeof window !== 'undefined' ? localStorage.getItem('techxodia_supabase_key') || '' : '';

  const url = localUrl.trim() || envUrl.trim();
  const key = localKey.trim() || envKey.trim();

  const isConfigured = Boolean(
    url &&
    key &&
    url.startsWith('https://') &&
    url.includes('supabase.co') &&
    key.length > 20
  );

  return { url, key, isConfigured };
};

export const getSupabaseConfig = () => {
  const creds = getStoredCredentials();
  return { url: creds.url, anonKey: creds.key, isConfigured: creds.isConfigured };
};

export const saveSupabaseConfig = (url: string, anonKey: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('techxodia_supabase_url', url.trim());
    localStorage.setItem('techxodia_supabase_key', anonKey.trim());
  }
};

let clientInstance: SupabaseClient | null = null;
let currentClientKey = '';

export const getSupabaseClient = (): SupabaseClient | null => {
  const { url, key, isConfigured } = getStoredCredentials();

  if (!isConfigured) {
    return null;
  }

  const cacheKey = `${url}::${key}`;
  if (clientInstance && currentClientKey === cacheKey) {
    return clientInstance;
  }

  try {
    clientInstance = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    currentClientKey = cacheKey;
    return clientInstance;
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
    return null;
  }
};

export interface FetchProductsResult {
  products: Product[];
  source: 'supabase' | 'fallback';
  error?: string;
}

export const sanitizeProduct = (p: Product): Product => {
  let image = p.image;
  if (image.includes('product_jug_64oz.jpg')) image = '/assets/product_jug_white.jpg';
  if (image.includes('product_bottle_28oz.jpg')) image = '/assets/product_bottle_white.jpg';
  if (image.includes('product_lunch_vault.jpg')) image = '/assets/product_lunch_vault_white.jpg';
  if (image.includes('product_flask_set.jpg')) image = '/assets/product_flask_white.jpg';
  if (image.includes('product_pet_bowl.jpg')) image = '/assets/product_pet_bowl_white.jpg';

  // Sanitize gallery
  const gallery = (p.gallery && p.gallery.length > 0 ? p.gallery : [image]).map((img) => {
    if (img.includes('hero_collab.jpg')) return '/assets/hero_white_luxury.jpg';
    if (img.includes('editorial_craft_detail.jpg')) return '/assets/editorial_white_craft.jpg';
    return img;
  });

  // Convert any legacy Desert Terracotta or #C86237 to Polar White
  const colors = (p.colors || []).map((c) => {
    if (c.name.toLowerCase().includes('terracotta') || c.hex.toLowerCase() === '#c86237') {
      return {
        name: 'Polar White',
        hex: '#FFFFFF',
        image: image || '/assets/product_jug_white.jpg',
      };
    }
    return c;
  });

  const hasWhite = colors.some((c) => c.hex.toLowerCase() === '#ffffff');
  const finalColors = hasWhite ? colors : [{ name: 'Polar White', hex: '#FFFFFF', image }, ...colors];

  return {
    ...p,
    image,
    gallery,
    colors: finalColors,
  };
};

const getLocalCustomProducts = (): Product[] | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('techxodia_custom_products');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // If legacy brown items detected, clear them so current Polar White catalog loads
      const hasLegacyBrown = parsed.some((p: Product) =>
        p.subtitle?.toLowerCase().includes('terracotta') ||
        p.colors?.some((c) => c.name.toLowerCase().includes('terracotta') || c.hex.toLowerCase() === '#c86237')
      );
      if (hasLegacyBrown) {
        localStorage.removeItem('techxodia_custom_products');
        return null;
      }
      return parsed.map(sanitizeProduct);
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * Fetch products from Supabase database or graceful fallback
 */
export async function fetchProducts(): Promise<FetchProductsResult> {
  const supabase = getSupabaseClient();
  const localProducts = (getLocalCustomProducts() || INITIAL_PRODUCTS).map(sanitizeProduct);

  if (!supabase) {
    return {
      products: localProducts,
      source: 'fallback',
      error: 'Supabase credentials not configured yet. Displaying live design catalog.'
    };
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('price', { ascending: false });

    if (error) {
      console.warn('Supabase query error, falling back to local products:', error.message);
      return {
        products: localProducts,
        source: 'fallback',
        error: error.message
      };
    }

    if (data && data.length > 0) {
      const mappedProducts: Product[] = data.map((item) => sanitizeProduct({
        id: item.id || item.slug,
        slug: item.slug,
        name: item.name,
        subtitle: item.subtitle,
        category: item.category,
        price: Number(item.price),
        original_price: item.original_price ? Number(item.original_price) : null,
        rating: Number(item.rating) || 4.9,
        reviews_count: Number(item.reviews_count) || 120,
        image: item.image,
        gallery: Array.isArray(item.gallery) && item.gallery.length > 0 ? item.gallery : [item.image],
        colors: Array.isArray(item.colors) ? item.colors : [],
        capacity: item.capacity || 'Standard',
        specs: Array.isArray(item.specs) ? item.specs : [],
        badge: item.badge,
        description: item.description,
        stock: Number(item.stock) ?? 25,
        is_featured: Boolean(item.is_featured)
      }));

      return {
        products: mappedProducts,
        source: 'supabase'
      };
    }

    return {
      products: localProducts,
      source: 'fallback',
      error: 'Connected to Supabase, but "products" table is empty. Click "Seed Database" in Admin.'
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Fetch products error:', message);
    return {
      products: localProducts,
      source: 'fallback',
      error: message
    };
  }
}

/**
 * Upsert product in Supabase or local storage
 */
export async function upsertProduct(product: Product): Promise<{ success: boolean; message: string }> {
  // Save locally first
  const currentLocal = getLocalCustomProducts() || [...INITIAL_PRODUCTS];
  const existingIdx = currentLocal.findIndex((p) => p.id === product.id || p.slug === product.slug);
  if (existingIdx > -1) {
    currentLocal[existingIdx] = product;
  } else {
    currentLocal.unshift(product);
  }
  localStorage.setItem('techxodia_custom_products', JSON.stringify(currentLocal));

  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: true, message: 'Saved to storefront catalog (Local mode).' };
  }

  try {
    const { error } = await supabase
      .from('products')
      .upsert({
        slug: product.slug,
        name: product.name,
        subtitle: product.subtitle,
        category: product.category,
        price: product.price,
        original_price: product.original_price,
        rating: product.rating,
        reviews_count: product.reviews_count,
        image: product.image,
        gallery: product.gallery,
        colors: product.colors,
        capacity: product.capacity,
        specs: product.specs,
        badge: product.badge,
        description: product.description,
        stock: product.stock,
        is_featured: product.is_featured,
      }, { onConflict: 'slug' });

    if (error) throw error;
    return { success: true, message: 'Product synchronized directly with Supabase database!' };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, message: `Saved locally, but Supabase error: ${msg}` };
  }
}

/**
 * Delete product
 */
export async function deleteProduct(productId: string, slug?: string): Promise<{ success: boolean; message: string }> {
  const currentLocal = getLocalCustomProducts() || [...INITIAL_PRODUCTS];
  const filtered = currentLocal.filter((p) => p.id !== productId && p.slug !== slug);
  localStorage.setItem('techxodia_custom_products', JSON.stringify(filtered));

  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: true, message: 'Deleted from local storefront catalog.' };
  }

  try {
    const query = slug ? supabase.from('products').delete().eq('slug', slug) : supabase.from('products').delete().eq('id', productId);
    const { error } = await query;
    if (error) throw error;
    return { success: true, message: 'Deleted from Supabase database.' };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, message: `Removed locally, but Supabase error: ${msg}` };
  }
}

/**
 * Seed or restore default products
 */
export async function seedSupabaseDatabase(): Promise<{ success: boolean; message: string }> {
  localStorage.removeItem('techxodia_custom_products');
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: true, message: 'Default Techxodia catalog restored (Local mode).' };
  }

  try {
    for (const p of INITIAL_PRODUCTS) {
      await supabase.from('products').upsert({
        slug: p.slug,
        name: p.name,
        subtitle: p.subtitle,
        category: p.category,
        price: p.price,
        original_price: p.original_price,
        rating: p.rating,
        reviews_count: p.reviews_count,
        image: p.image,
        gallery: p.gallery,
        colors: p.colors,
        capacity: p.capacity,
        specs: p.specs,
        badge: p.badge,
        description: p.description,
        stock: p.stock,
        is_featured: p.is_featured,
      }, { onConflict: 'slug' });
    }
    return { success: true, message: 'All 5 default products successfully seeded into Supabase!' };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, message: `Seeding error: ${msg}` };
  }
}

/**
 * Subscribe email to Supabase subscribers table
 */
export async function subscribeEmail(email: string): Promise<{ success: boolean; message: string }> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    const subs = JSON.parse(localStorage.getItem('techxodia_mock_subscribers') || '[]');
    subs.push({ email, date: new Date().toISOString() });
    localStorage.setItem('techxodia_mock_subscribers', JSON.stringify(subs));
    return {
      success: true,
      message: 'Subscribed successfully (Local Demo Mode). Add Supabase keys in settings to persist in database.'
    };
  }

  try {
    const { error } = await supabase
      .from('subscribers')
      .insert([{ email }]);

    if (error) {
      if (error.code === '23505') {
        return { success: true, message: 'You are already on the VIP access drop list!' };
      }
      throw error;
    }

    return { success: true, message: 'Welcome to the Techxodia Series 01 VIP drop registry.' };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, message: `Failed to subscribe: ${message}` };
  }
}

/**
 * Create order in Supabase orders table
 */
export async function createOrder(order: OrderRecord): Promise<{ success: boolean; orderId?: string; message: string }> {
  const preparedOrder: OrderRecord = {
    ...order,
    payment_status: order.payment_status || 'paid',
    receipt_sent: order.receipt_sent ?? false,
    created_at: order.created_at || new Date().toISOString(),
  };

  const supabase = getSupabaseClient();

  if (!supabase) {
    const orders = JSON.parse(localStorage.getItem('techxodia_mock_orders') || '[]');
    const mockId = preparedOrder.order_number || `TX-${Date.now().toString(36).toUpperCase()}`;
    orders.push({ ...preparedOrder, id: mockId });
    localStorage.setItem('techxodia_mock_orders', JSON.stringify(orders));
    return {
      success: true,
      orderId: mockId,
      message: 'Order placed & recorded locally! (Supabase in demo mode)',
    };
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([preparedOrder])
      .select('id, order_number')
      .single();

    if (error) {
      console.error('Error creating order in Supabase:', error);
      throw error;
    }

    return {
      success: true,
      orderId: data?.order_number || data?.id,
      message: 'Order created and reflected directly in Supabase database!',
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      message: `Database error: ${message}`,
    };
  }
}

/**
 * Fetch all orders from Supabase or local storage
 */
export async function fetchOrders(): Promise<{ orders: OrderRecord[]; source: 'supabase' | 'fallback' }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('techxodia_mock_orders') : null;
    const orders: OrderRecord[] = raw ? JSON.parse(raw) : [];
    return { orders: orders.reverse(), source: 'fallback' };
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { orders: (data as OrderRecord[]) || [], source: 'supabase' };
  } catch (err) {
    console.warn('Error fetching orders from Supabase:', err);
    const raw = typeof window !== 'undefined' ? localStorage.getItem('techxodia_mock_orders') : null;
    const orders: OrderRecord[] = raw ? JSON.parse(raw) : [];
    return { orders: orders.reverse(), source: 'fallback' };
  }
}

/**
 * Update order status or receipt metadata
 */
export async function updateOrderStatus(
  orderNumber: string,
  updates: Partial<OrderRecord>
): Promise<{ success: boolean; message: string }> {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('techxodia_mock_orders');
      if (raw) {
        const orders: OrderRecord[] = JSON.parse(raw);
        const idx = orders.findIndex((o) => o.order_number === orderNumber);
        if (idx > -1) {
          orders[idx] = { ...orders[idx], ...updates };
          localStorage.setItem('techxodia_mock_orders', JSON.stringify(orders));
        }
      }
    } catch {
      // ignore
    }
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: true, message: 'Order status updated locally.' };
  }

  try {
    const { error } = await supabase
      .from('orders')
      .update(updates)
      .eq('order_number', orderNumber);

    if (error) throw error;
    return { success: true, message: 'Order status synchronized to Supabase!' };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, message: `Updated locally, but Supabase error: ${msg}` };
  }
}

/**
 * Test a Supabase URL + Key connection
 */
export async function testSupabaseConnection(url: string, key: string): Promise<{ success: boolean; message: string; tableFound?: boolean }> {
  try {
    const testClient = createClient(url, key);
    const { error } = await testClient.from('products').select('count', { count: 'exact', head: true });

    if (error) {
      if (error.code === '42P01') {
        return {
          success: true,
          tableFound: false,
          message: 'Connected to Supabase! The "products" table does not exist yet. Please run supabase/schema.sql in the Supabase SQL Editor.'
        };
      }
      return {
        success: false,
        message: `Connection error: ${error.message}`
      };
    }

    return {
      success: true,
      tableFound: true,
      message: `Connection verified! Supabase is live and "products" table is accessible.`
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      message: `Connection failed: ${message}`
    };
  }
}

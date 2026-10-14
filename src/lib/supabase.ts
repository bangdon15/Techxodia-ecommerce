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

/**
 * Fetch products from Supabase database or graceful fallback
 */
export async function fetchProducts(): Promise<FetchProductsResult> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return {
      products: INITIAL_PRODUCTS,
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
        products: INITIAL_PRODUCTS,
        source: 'fallback',
        error: error.message
      };
    }

    if (data && data.length > 0) {
      // Map database row to Product type
      const mappedProducts: Product[] = data.map((item) => ({
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
      products: INITIAL_PRODUCTS,
      source: 'fallback',
      error: 'Connected to Supabase, but "products" table is empty. Run schema.sql or db:seed.'
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Fetch products error:', message);
    return {
      products: INITIAL_PRODUCTS,
      source: 'fallback',
      error: message
    };
  }
}

/**
 * Subscribe email to Supabase subscribers table
 */
export async function subscribeEmail(email: string): Promise<{ success: boolean; message: string }> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    // Save to local storage for testing
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
  const supabase = getSupabaseClient();

  if (!supabase) {
    const orders = JSON.parse(localStorage.getItem('techxodia_mock_orders') || '[]');
    const mockId = `TX-${Date.now().toString(36).toUpperCase()}`;
    orders.push({ ...order, id: mockId });
    localStorage.setItem('techxodia_mock_orders', JSON.stringify(orders));
    return {
      success: true,
      orderId: mockId,
      message: 'Order confirmed successfully (Demo Mock Mode). Connect Supabase to save to production database.'
    };
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([order])
      .select('id, order_number')
      .single();

    if (error) {
      console.error('Error creating order in Supabase:', error);
      throw error;
    }

    return {
      success: true,
      orderId: data?.order_number || data?.id,
      message: 'Order created and persisted directly in Supabase!'
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      message: `Database error: ${message}`
    };
  }
}

/**
 * Test a Supabase URL + Key connection
 */
export async function testSupabaseConnection(url: string, key: string): Promise<{ success: boolean; message: string; tableFound?: boolean }> {
  try {
    const testClient = createClient(url, key);
    const { data, error } = await testClient.from('products').select('count', { count: 'exact', head: true });

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

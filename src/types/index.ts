export interface ProductColor {
  name: string;
  hex: string;
  image?: string; // Designated high-res image for this color
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category: 'Hydration Vessels' | 'Field Gear' | 'Bar & Social' | 'All' | string;
  price: number;
  original_price: number | null;
  rating: number;
  reviews_count: number;
  image: string;
  gallery: string[];
  colors: ProductColor[];
  capacity: string;
  specs: ProductSpec[];
  badge?: string;
  description: string;
  stock: number;
  is_featured: boolean;
  created_at?: string;
}

export interface CartItem {
  product: Product;
  selectedColor: ProductColor;
  quantity: number;
  customEngraving?: string;
}

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rate: number;
}

export interface PaymentSettings {
  stripeEnabled: boolean;
  stripePublishableKey: string;
  stripeTestMode: boolean;
  paypalEnabled: boolean;
  paypalClientId: string;
  codEnabled: boolean;
  codInstructions: string;
  activeGateway: 'stripe' | 'paypal' | 'cod' | 'card_demo';
}

export interface StoreSettings {
  storeName: string;
  storeTagline: string;
  heroWallpaper: string;
  heroWallpaperPreset: string;
  heroHeadline: string;
  heroSubtitle: string;
  heroBadge: string;
  accentColor: string;
  announcementText: string;
  freeShippingThreshold: number;
  supportEmail: string;
  payment: PaymentSettings;
  resendApiKey?: string;
  fromEmail?: string;
}

export interface OrderRecord {
  id?: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_address: Record<string, string>;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    color: string;
    customEngraving?: string;
  }>;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  payment_method?: string;
  payment_status?: 'paid' | 'pending' | 'verified' | 'failed';
  receipt_sent?: boolean;
  receipt_sent_at?: string;
  status: string;
  created_at?: string;
}

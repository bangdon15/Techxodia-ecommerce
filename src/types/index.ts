export interface ProductColor {
  name: string;
  hex: string;
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
  category: 'Hydration Vessels' | 'Field Gear' | 'Bar & Social' | 'All';
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
  rate: number; // relative to USD
}

export interface OrderCustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
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
  status: string;
  created_at?: string;
}

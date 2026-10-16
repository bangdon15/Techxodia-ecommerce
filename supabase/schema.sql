-- ==============================================================================
-- TECHXODIA E-COMMERCE // SUPABASE DATABASE SCHEMA
-- Collaboration Series 01: Techxodia x Devin Booker Inspired Drop
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),
    rating NUMERIC(2, 1) DEFAULT 4.9,
    reviews_count INTEGER DEFAULT 128,
    image TEXT NOT NULL,
    gallery TEXT[] DEFAULT '{}',
    colors JSONB DEFAULT '[]'::jsonb,
    capacity TEXT,
    specs JSONB DEFAULT '[]'::jsonb,
    badge TEXT,
    description TEXT NOT NULL,
    stock INTEGER DEFAULT 50,
    is_featured BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS public.subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Customer Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    shipping_address JSONB NOT NULL,
    items JSONB NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    shipping NUMERIC(10, 2) DEFAULT 0.00,
    discount NUMERIC(10, 2) DEFAULT 0.00,
    total NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'confirmed',
    payment_method TEXT DEFAULT 'Online Card (Stripe)',
    payment_status TEXT DEFAULT 'paid',
    receipt_sent BOOLEAN DEFAULT false,
    receipt_sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Ensure migration compatibility for existing deployments
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'Online Card (Stripe)';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'paid';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS receipt_sent BOOLEAN DEFAULT false;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS receipt_sent_at TIMESTAMP WITH TIME ZONE;

-- 5. Row Level Security (RLS) Setup
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all active products
CREATE POLICY "Public products are viewable by everyone" 
ON public.products FOR SELECT USING (true);

-- Allow public / anon users to insert into subscribers
CREATE POLICY "Anyone can subscribe to newsletter" 
ON public.subscribers FOR INSERT WITH CHECK (true);

-- Allow public / anon users to place orders
CREATE POLICY "Anyone can create orders" 
ON public.orders FOR INSERT WITH CHECK (true);

-- Allow users and admin to view orders
CREATE POLICY "Customers and admin can view orders" 
ON public.orders FOR SELECT USING (true);

-- Allow updating order receipt and payment status
CREATE POLICY "Allow updating order status"
ON public.orders FOR UPDATE USING (true) WITH CHECK (true);

-- 6. Insert Default Seed Data (Techxodia Drop 01 - Polar White Series)
INSERT INTO public.products (slug, name, subtitle, category, price, original_price, rating, reviews_count, image, gallery, colors, capacity, specs, badge, description, stock, is_featured)
VALUES 
(
    'techxodia-horizon-flip-straw-jug-64oz',
    'Techxodia | Horizon Flip-Straw Jug 2.0',
    'Series 01 // Polar White Edition',
    'Hydration Vessels',
    75.00,
    85.00,
    4.9,
    184,
    '/assets/product_jug_white.jpg',
    ARRAY['/assets/product_jug_white.jpg', '/assets/hero_white_luxury.jpg', '/assets/editorial_white_craft.jpg'],
    '[
        {"name": "Polar White", "hex": "#FFFFFF", "image": "/assets/product_jug_white.jpg"},
        {"name": "Volcanic Obsidian", "hex": "#1F2124", "image": "/assets/product_jug_obsidian.jpg"},
        {"name": "Dune Sandstone", "hex": "#D8CEBC", "image": "/assets/product_jug_sandstone.jpg"}
    ]'::jsonb,
    '64 OZ / 1.9 L',
    '[
        {"label": "Thermal Insulation", "value": "36 Hours Ice Cold // 14 Hours Steaming"},
        {"label": "Material", "value": "18/8 Pro-Grade Recycled Stainless Steel"},
        {"label": "Lid System", "value": "Quick-Flip Straw with Integrated Leakproof Valve"},
        {"label": "Handle", "value": "Ergonomic Cast-Steel Pivot Carry Ring"},
        {"label": "Safety", "value": "BPA-Free & Commercial Dishwasher Safe"}
    ]'::jsonb,
    'LIMITED ARCHIVE DROP',
    'Engineered for long sessions in demanding arena sidelines or serene architectural environments. The 64oz Horizon Jug balances heavyweight thermal barrier technology with fluid ergonomics and baked polar white ceramic finish.',
    28,
    true
),
(
    'techxodia-wellspring-thermal-flask-28oz',
    'Techxodia x Series 01 Wellspring Flask',
    'Sculpted Commuter Silhouette // Matte Chalk White',
    'Hydration Vessels',
    52.00,
    null,
    4.9,
    112,
    '/assets/product_bottle_white.jpg',
    ARRAY['/assets/product_bottle_white.jpg', '/assets/editorial_white_craft.jpg'],
    '[
        {"name": "Matte Chalk White", "hex": "#FFFFFF", "image": "/assets/product_bottle_white.jpg"},
        {"name": "Volcanic Obsidian", "hex": "#1F2124", "image": "/assets/product_bottle_obsidian.jpg"},
        {"name": "Warm Travertine", "hex": "#EFECE4", "image": "/assets/product_bottle_white.jpg"}
    ]'::jsonb,
    '28 OZ / 0.82 L',
    '[
        {"label": "Thermal Retention", "value": "24 Hours Cold // 12 Hours Hot"},
        {"label": "Cap", "value": "Machined Steel Bail Handle with Magnetic Dock"},
        {"label": "Finish", "value": "Ceramic-Touch Satin Powder Coat"},
        {"label": "Cup Holder", "value": "Fits Standard Vehicle and Gym Consoles"}
    ]'::jsonb,
    'MOST POPULAR',
    'Refined, tactile, and effortlessly portable. The 28oz Wellspring Flask features a minimalist cylindrical form with high-strength loop cap and silence-glide silicone foot in chalk white.',
    42,
    true
),
(
    'techxodia-heritage-field-lunch-vault-10qt',
    'Techxodia Field Lunch Vault 10 QT',
    'Heavy-Duty Modular Cooler Vault // Polar White & Steel',
    'Field Gear',
    155.00,
    175.00,
    5.0,
    67,
    '/assets/product_lunch_vault_white.jpg',
    ARRAY['/assets/product_lunch_vault_white.jpg', '/assets/hero_white_luxury.jpg'],
    '[
        {"name": "Polar White & Chrome", "hex": "#FFFFFF", "image": "/assets/product_lunch_vault_white.jpg"},
        {"name": "Stealth Charcoal", "hex": "#272A30", "image": "/assets/product_lunch_vault_obsidian.jpg"}
    ]'::jsonb,
    '10 QT / 9.5 L',
    '[
        {"label": "Structure", "value": "Cold-Rolled SPCC Steel with Reinforced Ribbing"},
        {"label": "Latches", "value": "Cast Stainless Steel Precision Spring-Locks"},
        {"label": "Internal Bracket", "value": "Adjustable Bracket to Lock Jugs and Bottles in Place"},
        {"label": "Insulation", "value": "Commercial Closed-Cell Foam Retention Core"}
    ]'::jsonb,
    'COLLECTOR EDITION',
    'A brutalist tribute to classic American craftsmanship reimagined for modern utility. Features heavy-duty spring latches, custom lid brackets for securing Techxodia bottles, and high-impact structural corners in polar white.',
    14,
    true
),
(
    'techxodia-artisanal-pre-party-flask-set',
    'Techxodia Pre-Party Flask + 4 Shot Glass Set',
    'Numbered Pocket Spirit Kit // Satin Glacier White',
    'Bar & Social',
    58.00,
    null,
    4.8,
    93,
    '/assets/product_flask_white.jpg',
    ARRAY['/assets/product_flask_white.jpg', '/assets/editorial_white_craft.jpg'],
    '[
        {"name": "Satin Glacier White", "hex": "#FFFFFF", "image": "/assets/product_flask_white.jpg"},
        {"name": "Gunmetal Brushed", "hex": "#4A4D52", "image": "/assets/product_flask_white.jpg"}
    ]'::jsonb,
    '8 OZ Flask + 4x 2 OZ Shots',
    '[
        {"label": "Components", "value": "1x 8oz Slim Pocket Flask + 4x Nesting Shot Cups"},
        {"label": "Carrying Case", "value": "Threaded Stainless Transport Canister"},
        {"label": "Cap", "value": "Never-Lose Knurled Hinge Lanyard Cap"}
    ]'::jsonb,
    'EXCLUSIVE',
    'The quintessential social companion. Features a textured pocket flask with knurled cap tether and 4 nesting stainless shot tumblers encased in a sleek matching transit tube in glacier white.',
    35,
    true
),
(
    'techxodia-oasis-weighted-pet-bowl-24oz',
    'Techxodia Oasis Weighted Pet Bowl',
    'Weighted Non-Tip Stainless Ceramic Dish // Polar White',
    'Field Gear',
    42.00,
    null,
    4.9,
    81,
    '/assets/product_pet_bowl_white.jpg',
    ARRAY['/assets/product_pet_bowl_white.jpg'],
    '[
        {"name": "Polar White", "hex": "#FFFFFF", "image": "/assets/product_pet_bowl_white.jpg"},
        {"name": "Obsidian Black", "hex": "#000000", "image": "/assets/product_pet_bowl_white.jpg"}
    ]'::jsonb,
    '24 OZ / 0.7 L',
    '[
        {"label": "Base", "value": "Heavy-Gauge Weighted Non-Slip Silicone Ring"},
        {"label": "Lining", "value": "Electropolished Hygienic 304 Food-Grade Steel"},
        {"label": "Care", "value": "Dishwasher Safe & Rust-Proof"}
    ]'::jsonb,
    'LIMITED RUN',
    'Designed for companions who accompany you off the beaten path. Heavyweight, tip-proof base engineered with dual-layer temperature shielding to keep water refreshing even in high ambient temperatures.',
    60,
    false
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    subtitle = EXCLUDED.subtitle,
    price = EXCLUDED.price,
    image = EXCLUDED.image,
    gallery = EXCLUDED.gallery,
    colors = EXCLUDED.colors,
    description = EXCLUDED.description;

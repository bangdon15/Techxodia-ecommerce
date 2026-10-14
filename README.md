# TECHXODIA // SIGNATURE LUXURY ARCHIVE (SERIES 01)
> A premier editorial e-commerce replication of the **Stanley 1913 × Devin Booker Collaboration**, reimagined with custom **Techxodia** branding, signature terracotta & obsidian metallurgy, real-time **Supabase** database persistence, and instant **Vercel** deployment readiness.

---

## ⚡ Live Features & Architectural Highlights

1. **Editorial Luxury Aesthetic**:
   - Replicated after Stanley 1913's flagship Devin Booker desert modernist collaboration.
   - Brutalist typography, baked terracotta & obsidian color palette, and high-fashion campaign photography.
   - Custom **Techxodia** geometric monolith emblem.

2. **Supabase Cloud Integration**:
   - **`products` Table**: Fully queryable catalog with live stock tracking, color swatches, specs, and price formatting.
   - **`orders` Table**: Direct order insertion on checkout with line items, shipping address, and generated reference code (`TX-XXXXXX`).
   - **`subscribers` Table**: Live newsletter VIP registry with duplicate detection.
   - **Dual-Mode Engine**: Operates with zero downtime—seamlessly pulls from your live Supabase database when credentials are provided, or falls back to the rich local catalog if credentials are being configured.
   - **Interactive Connection Inspector**: Test your database connection live directly inside the UI.

3. **High-Performance E-Commerce Features**:
   - **Dynamic Currency Switcher**: Real-time conversion across **USD ($)**, **EUR (€)**, **GBP (£)**, and **JPY (¥)**.
   - **Free Shipping Progress Meter**: Live calculation towards free courier shipping threshold.
   - **Laser Engraving Personalization**: Live preview of custom text engraved on reverse side.
   - **Slide-Over Bag Drawer**: Real-time quantity adjustment, coupon code (`TECH10`), and subtotal calculations.
   - **Quick View Modal**: Multi-angle gallery inspection, color variant picker, and specs matrix.
   - **Live Instant Search**: Filter archive products on the fly.

---

## 📦 Products in Drop 01

| Product | Capacity | Price | Key Highlight |
|---|---|---|---|
| **Techxodia Horizon Flip-Straw Jug 2.0** | 64 OZ / 1.9L | $75.00 | 36hr TempLock™, Cast titanium pivot handle |
| **Techxodia Wellspring Thermal Flask** | 28 OZ / 0.82L | $52.00 | Slim car-console profile, magnetic cap dock |
| **Techxodia Field Lunch Vault** | 10 QT / 9.5L | $155.00 | SPCC cold-rolled steel, custom jug brackets |
| **Techxodia Artisanal Pre-Party Flask Set** | 8 OZ + 4x 2 OZ | $58.00 | Gunmetal knurled cap, nesting shot cylinders |
| **Techxodia Oasis Weighted Pet Bowl** | 24 OZ / 0.7L | $42.00 | Heavy non-tip silicone ring, double-wall cold |

---

## 🚀 Setting Up Supabase (3 Easy Steps)

### 1. Run the Database Schema
1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to the **SQL Editor**.
3. Copy and run the entire contents of [`supabase/schema.sql`](./supabase/schema.sql).
   *(This creates `products`, `orders`, and `subscribers` tables, enables Row-Level Security, and populates the initial drop).*

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

### 3. (Optional) Seed via Command Line
```bash
npm run db:seed
```

*(You can also click the **"SUPABASE SETUP"** pill directly in the top website navbar to input your URL and key right in the browser!)*

---

## 🌐 Deploy to Vercel

This repository includes a pre-configured [`vercel.json`](./vercel.json) for smooth single-page application routing.

1. Push this repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete Techxodia x Series 01 e-commerce drop with Supabase"
   git push origin main
   ```
2. Import the repository in [Vercel](https://vercel.com/new).
3. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Click **Deploy**!

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Build for production
npm run build
```

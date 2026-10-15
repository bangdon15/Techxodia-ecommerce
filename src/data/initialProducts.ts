import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    slug: 'techxodia-horizon-flip-straw-jug-64oz',
    name: 'Techxodia | Horizon Flip-Straw Jug 2.0',
    subtitle: 'Series 01 // Hidden In Plain Sight Edition',
    category: 'Hydration Vessels',
    price: 75.00,
    original_price: 85.00,
    rating: 4.9,
    reviews_count: 184,
    image: '/assets/product_jug_64oz.jpg',
    gallery: [
      '/assets/product_jug_64oz.jpg',
      '/assets/product_jug_obsidian.jpg',
      '/assets/product_jug_sandstone.jpg',
      '/assets/hero_collab.jpg',
      '/assets/editorial_craft_detail.jpg'
    ],
    colors: [
      { name: 'Desert Terracotta', hex: '#C86237', image: '/assets/product_jug_64oz.jpg' },
      { name: 'Volcanic Obsidian', hex: '#1F2124', image: '/assets/product_jug_obsidian.jpg' },
      { name: 'Dune Sandstone', hex: '#D8CEBC', image: '/assets/product_jug_sandstone.jpg' }
    ],
    capacity: '64 OZ / 1.9 L',
    specs: [
      { label: 'Thermal Retention', value: '36 Hours Ice Cold // 14 Hours Steaming' },
      { label: 'Construction', value: '18/8 Pro-Grade Recycled Stainless Steel' },
      { label: 'Lid System', value: 'Quick-Flip Straw with Integrated Leakproof Valve' },
      { label: 'Handle', value: 'Cast-Steel Ergonomic Pivot Carry Ring' },
      { label: 'Safety', value: 'BPA-Free & Commercial Dishwasher Safe' }
    ],
    badge: 'LIMITED ARCHIVE DROP',
    description: 'Engineered for long sessions in desert heat or demanding arena sidelines. The 64oz Horizon Jug balances heavyweight thermal barrier technology with fluid, single-handed ergonomics and custom baked terracotta matte finish.',
    stock: 28,
    is_featured: true
  },
  {
    id: 'prod-002',
    slug: 'techxodia-wellspring-thermal-flask-28oz',
    name: 'Techxodia x Series 01 Wellspring Flask',
    subtitle: 'Sculpted Commuter Silhouette // Desert Clay',
    category: 'Hydration Vessels',
    price: 52.00,
    original_price: null,
    rating: 4.9,
    reviews_count: 112,
    image: '/assets/product_bottle_28oz.jpg',
    gallery: [
      '/assets/product_bottle_28oz.jpg',
      '/assets/product_bottle_obsidian.jpg',
      '/assets/editorial_craft_detail.jpg'
    ],
    colors: [
      { name: 'Desert Terracotta', hex: '#C86237', image: '/assets/product_bottle_28oz.jpg' },
      { name: 'Volcanic Obsidian', hex: '#1F2124', image: '/assets/product_bottle_obsidian.jpg' },
      { name: 'Warm Travertine', hex: '#EFECE4', image: '/assets/product_bottle_28oz.jpg' }
    ],
    capacity: '28 OZ / 0.82 L',
    specs: [
      { label: 'Thermal Retention', value: '24 Hours Cold // 12 Hours Hot' },
      { label: 'Cap Mechanism', value: 'Machined Steel Bail Handle with Magnetic Dock' },
      { label: 'Exterior Finish', value: 'Ceramic-Touch Satin Powder Coat' },
      { label: 'Compatibility', value: 'Fits Standard Vehicle & Gym Consoles' }
    ],
    badge: 'MOST POPULAR',
    description: 'Refined, tactile, and effortlessly portable. The 28oz Wellspring Flask features a minimalist cylindrical form with high-strength loop cap and silence-glide silicone foot.',
    stock: 42,
    is_featured: true
  },
  {
    id: 'prod-003',
    slug: 'techxodia-heritage-field-lunch-vault-10qt',
    name: 'Techxodia Field Lunch Vault 10 QT',
    subtitle: 'Heavy-Duty Modular Cooler Vault // Dual Tone',
    category: 'Field Gear',
    price: 155.00,
    original_price: 175.00,
    rating: 5.0,
    reviews_count: 67,
    image: '/assets/product_lunch_vault.jpg',
    gallery: [
      '/assets/product_lunch_vault.jpg',
      '/assets/product_lunch_vault_obsidian.jpg',
      '/assets/hero_collab.jpg'
    ],
    colors: [
      { name: 'Terracotta & Matte Onyx', hex: '#C86237', image: '/assets/product_lunch_vault.jpg' },
      { name: 'Stealth Charcoal', hex: '#272A30', image: '/assets/product_lunch_vault_obsidian.jpg' }
    ],
    capacity: '10 QT / 9.5 L',
    specs: [
      { label: 'Structure', value: 'Cold-Rolled SPCC Steel with Reinforced Ribbing' },
      { label: 'Latches', value: 'Cast Stainless Steel Precision Spring-Locks' },
      { label: 'Internal Storage', value: 'Adjustable Bracket to Lock Jugs and Bottles in Place' },
      { label: 'Insulation', value: 'Commercial Closed-Cell Foam Retention Core' }
    ],
    badge: 'COLLECTOR EDITION',
    description: 'A brutalist tribute to classic American craftsmanship reimagined for modern utility. Features heavy-duty spring latches, custom lid brackets for securing Techxodia bottles, and high-impact structural corners.',
    stock: 14,
    is_featured: true
  },
  {
    id: 'prod-004',
    slug: 'techxodia-artisanal-pre-party-flask-set',
    name: 'Techxodia Pre-Party Flask + 4 Shot Glass Set',
    subtitle: 'Numbered Pocket Spirit Kit // Gunmetal Accents',
    category: 'Bar & Social',
    price: 58.00,
    original_price: null,
    rating: 4.8,
    reviews_count: 93,
    image: '/assets/product_flask_set.jpg',
    gallery: [
      '/assets/product_flask_set.jpg',
      '/assets/editorial_craft_detail.jpg'
    ],
    colors: [
      { name: 'Desert Terracotta', hex: '#C86237', image: '/assets/product_flask_set.jpg' },
      { name: 'Gunmetal Brushed', hex: '#4A4D52', image: '/assets/product_flask_set.jpg' }
    ],
    capacity: '8 OZ Flask + 4x 2 OZ Shots',
    specs: [
      { label: 'Components', value: '1x 8oz Slim Pocket Flask + 4x Nesting Shot Cups' },
      { label: 'Carrying Case', value: 'Threaded Stainless Transport Canister' },
      { label: 'Cap Retention', value: 'Never-Lose Knurled Hinge Lanyard Cap' }
    ],
    badge: 'EXCLUSIVE',
    description: 'The quintessential social companion. Features a textured pocket flask with knurled cap tether and 4 nesting stainless shot tumblers encased in a sleek matching transit tube.',
    stock: 35,
    is_featured: true
  },
  {
    id: 'prod-005',
    slug: 'techxodia-oasis-weighted-pet-bowl-24oz',
    name: 'Techxodia Oasis Weighted Pet Bowl',
    subtitle: 'Weighted Non-Tip Stainless Ceramic Dish // 24 OZ',
    category: 'Field Gear',
    price: 42.00,
    original_price: null,
    rating: 4.9,
    reviews_count: 81,
    image: '/assets/product_pet_bowl.jpg',
    gallery: [
      '/assets/product_pet_bowl.jpg'
    ],
    colors: [
      { name: 'Desert Terracotta', hex: '#C86237', image: '/assets/product_pet_bowl.jpg' },
      { name: 'Sand Dune', hex: '#D8CEBC', image: '/assets/product_pet_bowl.jpg' }
    ],
    capacity: '24 OZ / 0.7 L',
    specs: [
      { label: 'Base Weight', value: 'Heavy-Gauge Weighted Non-Slip Silicone Ring' },
      { label: 'Interior', value: 'Electropolished Hygienic 304 Food-Grade Steel' },
      { label: 'Care & Cleaning', value: 'Dishwasher Safe & Rust-Proof' }
    ],
    badge: 'LIMITED RUN',
    description: 'Designed for companions who accompany you off the beaten path. Heavyweight, tip-proof base engineered with dual-layer temperature shielding to keep water refreshing even in high ambient temperatures.',
    stock: 60,
    is_featured: false
  }
];

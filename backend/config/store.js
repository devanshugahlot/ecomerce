import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORE_PATH = path.join(__dirname, '..', 'data', 'db_store.json');

// Ensure data folder exists
const dataDir = path.dirname(STORE_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const DEFAULT_STORE = {
  users: [
    { _id: 'usr_admin', name: 'Hypril Admin', email: 'admin@hypril.com', phone: '+91 9876543210', passwordHash: '$2a$10$w09ZkMvg4xGedFq8.8d1jOsnW01GZ18cM3nZ4/sM7F67b3Z2N77S6', role: 'admin', createdAt: new Date().toISOString() },
    { _id: 'usr_customer', name: 'Vikram Rao', email: 'user@hypril.com', phone: '+91 9876543211', passwordHash: '$2a$10$w09ZkMvg4xGedFq8.8d1jOsnW01GZ18cM3nZ4/sM7F67b3Z2N77S6', role: 'user', createdAt: new Date().toISOString() }
  ],
  products: [
    {
      _id: 'prod_1',
      id: 'prod_1',
      name: "Hypril™ Enlargement Oil (100ml)",
      slug: "hypril-enlargement-oil-100ml",
      category: "Enlargement Oils",
      price: 1299,
      comparePrice: 1999,
      stock: 50,
      rating: 4.9,
      reviewCount: 2,
      isBestSeller: true,
      isFeatured: true,
      benefitSummary: "Bigger size, stronger performance & improved blood flow for men.",
      description: "Doctor-formulated Hypril™ Enlargement Oil (100ml) engineered with pure herbal botanical extracts to boost circulation, tissue responsiveness, and stamina during intimate moments.",
      images: ["/images/hypril_oil.jpg"],
      image: "/images/hypril_oil.jpg",
      ingredients: "Gokshura, Ashwagandha, Jaiphal Oil, Malkangani Oil, Clove Oil, Sesame Base Oil.",
      usage: "Take 5-10 drops, massage gently twice daily till fully absorbed.",
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'prod_2',
      id: 'prod_2',
      name: "Hypril™ Extended Delay Gel (50ml)",
      slug: "hypril-extended-delay-gel-50ml",
      category: "Delay Gels",
      price: 999,
      comparePrice: 1499,
      stock: 40,
      rating: 4.95,
      reviewCount: 1,
      isBestSeller: true,
      isFeatured: true,
      benefitSummary: "Longer performance, control, confidence & pleasant cooling sensation.",
      description: "Engineered for maximum climax timing control and duration extension. Fast-acting non-sticky gel formulation with a refreshing cooling effect and skin-safe formula.",
      images: ["/images/hypril_delay_gel.jpg"],
      image: "/images/hypril_delay_gel.jpg",
      ingredients: "L-Arginine, Menthol Cooling Extract, Aloe Vera Gel, Vitamin E, Purified Water Base.",
      usage: "Apply small pump 10-15 minutes prior to intimate activity. Wash off before intercourse if needed.",
      isActive: true,
      createdAt: new Date().toISOString()
    }
  ],
  orders: [],
  coupons: [
    { _id: 'coup_1', code: 'HYPRIL10', discountType: 'percentage', discountValue: 10, minOrderAmount: 0, maxDiscountAmount: 1000, usageLimit: 1000, usedCount: 0, usersUsed: [], isActive: true },
    { _id: 'coup_2', code: 'BOLD10', discountType: 'percentage', discountValue: 10, minOrderAmount: 0, maxDiscountAmount: 1000, usageLimit: 1000, usedCount: 0, usersUsed: [], isActive: true },
    { _id: 'coup_3', code: 'HYPRIL20', discountType: 'percentage', discountValue: 20, minOrderAmount: 0, maxDiscountAmount: 1000, usageLimit: 1000, usedCount: 0, usersUsed: [], isActive: true },
    { _id: 'coup_4', code: 'WELLNESS200', discountType: 'fixed', discountValue: 200, minOrderAmount: 999, maxDiscountAmount: 200, usageLimit: 1000, usedCount: 0, usersUsed: [], isActive: true }
  ],
  categories: [
    { _id: 'cat_1', id: 'cat_1', name: 'Enlargement Oils', slug: 'enlargement-oils', badge: 'POPULAR', image: '/images/cat_shilajit.png' },
    { _id: 'cat_2', id: 'cat_2', name: 'Delay Gels', slug: 'delay-gels', badge: 'BEST SELLER', image: '/images/cat_extend.png' }
  ],
  banners: { heroBanner: '', promoBanner1: '' },
  reviews: [
    {
      _id: 'rev_1',
      id: 'rev_1',
      productIdStr: 'hypril-enlargement-oil-100ml',
      user: 'usr_customer',
      name: 'Vikram Rao',
      rating: 5,
      title: 'Amazing product!',
      comment: 'Noticeable results within 10 days of regular application. Highly recommended!',
      verified: true,
      helpful: 12,
      createdAt: new Date().toISOString()
    }
  ]
};

export function getStore() {
  try {
    if (!fs.existsSync(STORE_PATH)) {
      fs.writeFileSync(STORE_PATH, JSON.stringify(DEFAULT_STORE, null, 2), 'utf-8');
      return DEFAULT_STORE;
    }
    const raw = fs.readFileSync(STORE_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading JSON store:', err);
    return DEFAULT_STORE;
  }
}

export function saveStore(data) {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving JSON store:', err);
  }
}

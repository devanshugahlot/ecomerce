import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/User.js';
import { Product } from './models/Product.js';
import { Category } from './models/Category.js';
import { Banner } from './models/Banner.js';
import { Coupon } from './models/Coupon.js';
import { connectDB } from './config/db.js';

dotenv.config();

const demoCategories = [
  { name: 'Enlargement Oils', slug: 'enlargement-oils', badge: 'POPULAR', image: '/images/cat_shilajit.png' },
  { name: 'Delay Gels', slug: 'delay-gels', badge: 'BEST SELLER', image: '/images/cat_extend.png' },
  { name: 'Stamina Boosters', slug: 'stamina-boosters', badge: 'CLINICAL', image: '/images/cat_surge.png' },
  { name: 'Hair Care', slug: 'hair-care', badge: 'NEW', image: '/images/cat_hair.png' },
];

const demoProducts = [
  {
    name: "Hypril™ Enlargement Oil (100ml)",
    slug: "hypril-enlargement-oil-100ml",
    category: "Enlargement Oils",
    price: 1299,
    comparePrice: 1999,
    stock: 50,
    rating: 4.9,
    reviewCount: 328,
    isBestSeller: true,
    isFeatured: true,
    benefitSummary: "Bigger size, stronger performance & improved blood flow for men.",
    description: "Doctor-formulated Hypril™ Enlargement Oil (100ml) engineered with pure herbal botanical extracts to boost circulation, tissue responsiveness, and stamina during intimate moments.",
    images: ["/images/hypril_oil.jpg"],
    image: "/images/hypril_oil.jpg",
    ingredients: "Gokshura, Ashwagandha, Jaiphal Oil, Malkangani Oil, Clove Oil, Sesame Base Oil.",
    usage: "Take 5-10 drops, massage gently twice daily till fully absorbed.",
  },
  {
    name: "Hypril™ Extended Delay Gel (50ml)",
    slug: "hypril-extended-delay-gel-50ml",
    category: "Delay Gels",
    price: 999,
    comparePrice: 1499,
    stock: 40,
    rating: 4.95,
    reviewCount: 245,
    isBestSeller: true,
    isFeatured: true,
    benefitSummary: "Longer performance, control, confidence & pleasant cooling sensation.",
    description: "Engineered for maximum climax timing control and duration extension. Fast-acting non-sticky gel formulation with a refreshing cooling effect and skin-safe formula.",
    images: ["/images/hypril_delay_gel.jpg"],
    image: "/images/hypril_delay_gel.jpg",
    ingredients: "L-Arginine, Menthol Cooling Extract, Aloe Vera Gel, Vitamin E, Purified Water Base.",
    usage: "Apply small pump 10-15 minutes prior to intimate activity.",
  },
  {
    name: "Hypril™ Surge Stamina Capsules (60 Caps)",
    slug: "hypril-surge-stamina-capsules-60-caps",
    category: "Stamina Boosters",
    price: 1199,
    comparePrice: 1799,
    stock: 60,
    rating: 4.85,
    reviewCount: 189,
    isBestSeller: true,
    isFeatured: true,
    benefitSummary: "Natural energy, testosterone support & daily vitality booster.",
    description: "Clinical grade herbal formulation designed for daily stamina, energy restoration, and vitality support.",
    images: ["/images/cat_surge.png"],
    image: "/images/cat_surge.png",
    ingredients: "Shilajit, Safed Musli, Ashwagandha, Kaunch Beej.",
    usage: "Take 1 capsule twice daily with milk or water after meals.",
  },
  {
    name: "Hypril™ Alpha Shilajit Gold Resin (20g)",
    slug: "hypril-alpha-shilajit-gold-resin-20g",
    category: "Stamina Boosters",
    price: 1499,
    comparePrice: 2499,
    stock: 35,
    rating: 5.0,
    reviewCount: 412,
    isBestSeller: true,
    isFeatured: true,
    benefitSummary: "100% pure Himalayan Shilajit resin with Gold Vark & Fulvic Acid 80%+.",
    description: "Purified Himalayan Shilajit resin enriched with Swarna Bhasma for peak energy, stamina, and anti-fatigue performance.",
    images: ["/images/cat_shilajit.png"],
    image: "/images/cat_shilajit.png",
    ingredients: "Pure Himalayan Shilajit, Swarna Bhasma (Gold Vark), Rajat Bhasma.",
    usage: "Dissolve pea-sized portion (300-500mg) in warm milk or tea daily.",
  },
  {
    name: "Hypril™ Hair Regrowth Serum (60ml)",
    slug: "hypril-hair-regrowth-serum-60ml",
    category: "Hair Care",
    price: 899,
    comparePrice: 1299,
    stock: 45,
    rating: 4.8,
    reviewCount: 156,
    isBestSeller: false,
    isFeatured: true,
    benefitSummary: "Reduces hair fall, stimulates roots & promotes thicker hair growth.",
    description: "Advanced follicle revitalizing serum infused with Redensyl, Procapil, and Biotin for stronger, fuller hair.",
    images: ["/images/cat_hair.png"],
    image: "/images/cat_hair.png",
    ingredients: "Redensyl 3%, Procapil 3%, Biotin, Saw Palmetto Extract.",
    usage: "Apply 1ml with dropper onto dry scalp once daily at bedtime.",
  },
];

const demoCoupons = [
  { code: 'HYPRIL10', discountType: 'percentage', discountValue: 10, minOrderAmount: 0, maxDiscountAmount: 1000, usageLimit: 1000, isActive: true },
  { code: 'HYPRIL20', discountType: 'percentage', discountValue: 20, minOrderAmount: 0, maxDiscountAmount: 1000, usageLimit: 1000, isActive: true },
  { code: 'BOLD10', discountType: 'percentage', discountValue: 10, minOrderAmount: 0, maxDiscountAmount: 1000, usageLimit: 1000, isActive: true },
  { code: 'WELLNESS200', discountType: 'fixed', discountValue: 200, minOrderAmount: 999, maxDiscountAmount: 200, usageLimit: 1000, isActive: true },
];

export const seedData = async () => {
  await connectDB();
  console.log('[Seed] Seeding Hypril MongoDB database idempotently...');

  try {
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@hypril.com').trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';

    // 1. Seed Admin User
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await User.create({
        name: 'Hypril Admin',
        email: adminEmail,
        phone: '+91 9876543210',
        password: adminPassword,
        role: 'admin',
      });
      console.log('✔ Admin user created');
    } else {
      console.log('✔ Admin user already exists');
    }

    // 2. Seed Customer User
    const existingCustomer = await User.findOne({ email: 'user@hypril.com' });
    if (!existingCustomer) {
      await User.create({
        name: 'Vikram Rao',
        email: 'user@hypril.com',
        phone: '+91 9876543211',
        password: 'User@123',
        role: 'user',
      });
      console.log('✔ Default customer user created');
    }

    // 3. Seed Categories
    for (const cat of demoCategories) {
      const exists = await Category.findOne({ slug: cat.slug });
      if (!exists) {
        await Category.create(cat);
      }
    }
    console.log('✔ Categories checked/seeded');

    // 4. Seed Products
    for (const prod of demoProducts) {
      const exists = await Product.findOne({ slug: prod.slug });
      if (!exists) {
        await Product.create(prod);
      }
    }
    console.log('✔ Products checked/seeded');

    // 5. Seed Banners
    const existingBanner = await Banner.findOne();
    if (!existingBanner) {
      await Banner.create({
        heroBanner: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=1400',
        promoBanner1: '',
      });
      console.log('✔ Banners created');
    }

    // 6. Seed Coupons
    for (const coup of demoCoupons) {
      const exists = await Coupon.findOne({ code: coup.code });
      if (!exists) {
        await Coupon.create(coup);
      }
    }
    console.log('✔ Coupons checked/seeded');

    console.log('[Seed Complete] Hypril MongoDB database is fully initialized.');
  } catch (error) {
    console.error('[Seed Error]', error.message);
    process.exit(1);
  }
};

if (process.argv[1].includes('seed.js')) {
  seedData().then(() => mongoose.connection.close());
}

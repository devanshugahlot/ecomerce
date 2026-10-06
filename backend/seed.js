import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/User.js';
import { Product } from './models/Product.js';
import { Coupon } from './models/Coupon.js';
import { connectDB } from './config/db.js';

dotenv.config();

const demoProducts = [
  {
    name: "VYRO Surge — Endurance & Stamina Gummies",
    slug: "vyro-surge-endurance-stamina-gummies",
    category: "Sexual Wellness",
    price: 699,
    comparePrice: 999,
    stock: 45,
    rating: 4.9,
    reviewCount: 342,
    isBestSeller: true,
    isFeatured: true,
    benefitSummary: "L-Arginine, Gokshura & Safed Musli gummies for elevated blood flow & lasting vigor.",
    description: "Doctor-formulated daily gummies engineered for natural nitric oxide elevation, increased circulation, and enhanced bedroom endurance. Formulated with pure Gokshura, Safed Musli, and L-Arginine.",
    images: ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800"],
    ingredients: "Gokshura Extract (250mg), Safed Musli (200mg), L-Arginine (500mg), Zinc Monomethionine (12mg).",
    usage: "Chew 2 gummies daily after meals."
  },
  {
    name: "Pure Himalayan Shilajit Gold Resin",
    slug: "pure-himalayan-shilajit-gold-resin",
    category: "Daily Performance",
    price: 1299,
    comparePrice: 1799,
    stock: 28,
    rating: 4.95,
    reviewCount: 512,
    isBestSeller: true,
    isFeatured: true,
    benefitSummary: ">75% Fulvic Acid purified soft resin enriched with 24K edible Gold Vasma.",
    description: "Harvested from high-altitude Himalayan peaks above 18,000 ft. Purified using traditional Shodhana methods and lab-tested for heavy metals and purity.",
    images: ["https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&q=80&w=800"],
    ingredients: "100% Pure Himalayan Shilajit Resin (75% Fulvic Acid), Swarna Bhasma (24K Gold).",
    usage: "Dissolve pea-sized portion in warm milk once daily."
  },
  {
    name: "VYRO Apex — 5% Minoxidil + Redensyl Hair Growth Drops",
    slug: "vyro-apex-minoxidil-redensyl-hair-growth-drops",
    category: "Grooming & Beard",
    price: 899,
    comparePrice: 1299,
    stock: 60,
    rating: 4.8,
    reviewCount: 289,
    isBestSeller: false,
    isFeatured: true,
    benefitSummary: "Clinically proven formula for reactivating dormant scalp hair follicles & thickening beard density.",
    description: "Non-greasy hair growth tonic engineered with 5% Minoxidil, 3% Redensyl, Procapil, and Saw Palmetto.",
    images: ["https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&q=80&w=800"],
    ingredients: "Minoxidil 5%, Redensyl 3%, Procapil 2%, Saw Palmetto.",
    usage: "Apply 1ml twice daily onto clean scalp or beard."
  }
];

const seedData = async () => {
  await connectDB();
  console.log('[Seed] Seeding VYRO database...');

  try {
    // Clear existing
    await User.deleteMany({});
    await Product.deleteMany({});
    await Coupon.deleteMany({});

    // Seed Admin
    await User.create({
      name: 'Demo Admin',
      email: 'admin@vyro.men',
      phone: '+91 9876543210',
      password: 'Admin@123',
      role: 'admin',
    });

    // Seed Customer
    await User.create({
      name: 'Vikram Rao',
      email: 'user@vyro.men',
      phone: '+91 9876543211',
      password: 'User@123',
      role: 'user',
    });

    // Seed Products
    await Product.insertMany(demoProducts);

    // Seed Coupons
    await Coupon.create({
      code: 'VYRO10',
      discountType: 'percentage',
      discountValue: 10,
    });

    console.log('[Seed] Database seeded successfully!');
    console.log('Admin Email: admin@vyro.men | Password: Admin@123');
    process.exit();
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedData();

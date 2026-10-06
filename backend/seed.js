import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/User.js';
import { Product } from './models/Product.js';
import { Coupon } from './models/Coupon.js';
import { connectDB } from './config/db.js';

dotenv.config();

const demoProducts = [
  {
    name: "Hypril™ Enlargement Oil (100ml)",
    slug: "hypril-enlargement-oil-100ml",
    category: "Enlargement Oils",
    price: 1299,
    comparePrice: 1999,
    originalPrice: 1999,
    stock: 50,
    rating: 4.9,
    numReviews: 328,
    reviewCount: 328,
    isBestSeller: true,
    isFeatured: true,
    benefitSummary: "Bigger size, stronger performance & improved blood flow for men.",
    description: "Doctor-formulated Hypril™ Enlargement Oil (100ml) engineered with pure herbal botanical extracts to boost circulation, tissue responsiveness, and stamina during intimate moments.",
    images: ["/images/hypril_oil.jpg"],
    image: "/images/hypril_oil.jpg",
    ingredients: "Gokshura, Ashwagandha, Jaiphal Oil, Malkangani Oil, Clove Oil, Sesame Base Oil.",
    usage: "Take 5-10 drops, massage gently twice daily till fully absorbed.",
    keyBenefits: [
      "Enhances Size & Girth",
      "Improves Stamina",
      "Boosts Local Blood Flow",
      "100% Skin Safe Formula"
    ]
  },
  {
    name: "Hypril™ Extended Delay Gel (50ml)",
    slug: "hypril-extended-delay-gel-50ml",
    category: "Delay Gels",
    price: 999,
    comparePrice: 1499,
    originalPrice: 1499,
    stock: 40,
    rating: 4.95,
    numReviews: 245,
    reviewCount: 245,
    isBestSeller: true,
    isFeatured: true,
    benefitSummary: "Longer performance, control, confidence & pleasant cooling sensation.",
    description: "Engineered for maximum climax timing control and duration extension. Fast-acting non-sticky gel formulation with a refreshing cooling effect and skin-safe formula.",
    images: ["/images/hypril_delay_gel.jpg"],
    image: "/images/hypril_delay_gel.jpg",
    ingredients: "L-Arginine, Menthol Cooling Extract, Aloe Vera Gel, Vitamin E, Purified Water Base.",
    usage: "Apply small pump 10-15 minutes prior to intimate activity. Wash off before intercourse if needed.",
    keyBenefits: [
      "Delay Performance & Duration",
      "Cooling Sensation",
      "Skin Safe & Non-Sticky Formula",
      "Maximum Intimate Confidence"
    ]
  }
];

const seedData = async () => {
  await connectDB();
  console.log('[Seed] Seeding Hypril database...');

  try {
    // Clear existing
    await User.deleteMany({});
    await Product.deleteMany({});
    await Coupon.deleteMany({});

    // Seed Admin
    await User.create({
      name: 'Hypril Admin',
      email: 'admin@hypril.com',
      phone: '+91 9876543210',
      password: 'Admin@123',
      role: 'admin',
    });

    // Seed Customer
    await User.create({
      name: 'Vikram Rao',
      email: 'user@hypril.com',
      phone: '+91 9876543211',
      password: 'User@123',
      role: 'user',
    });

    // Seed Products
    await Product.insertMany(demoProducts);

    // Seed Coupons
    await Coupon.create({
      code: 'HYPRIL10',
      discountType: 'percentage',
      discountValue: 10,
      minOrderAmount: 0,
      isActive: true,
    });

    console.log('[Seed] Database seeded successfully!');
    console.log('Admin Email: admin@hypril.com | Password: Admin@123');
    process.exit();
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedData();

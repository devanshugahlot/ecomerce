import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    comparePrice: { type: Number, default: 0 },
    stock: { type: Number, default: 50 },
    sku: { type: String },
    images: [{ type: String }],
    benefitSummary: { type: String },
    description: { type: String, required: true },
    benefits: [{ type: String }],
    ingredients: { type: String },
    usage: { type: String },
    rating: { type: Number, default: 4.8 },
    reviewCount: { type: Number, default: 0 },
    isBestSeller: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Product = mongoose.model('Product', productSchema);

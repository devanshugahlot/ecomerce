import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.Mixed, ref: 'Product' },
    productIdStr: { type: String, required: true },
    user: { type: mongoose.Schema.Types.Mixed, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, trim: true, default: '' },
    comment: { type: String, required: true, trim: true },
    image: { type: String, default: null },
    verified: { type: Boolean, default: true },
    helpful: { type: Number, default: 0 },
  },
  { timestamps: true }
);

reviewSchema.index({ user: 1, productIdStr: 1 }, { unique: true });

export const Review = mongoose.model('Review', reviewSchema);

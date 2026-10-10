import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    productIdStr: { type: String, required: true }, // handles slug or string IDs
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
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

export const Review = mongoose.model('Review', reviewSchema);

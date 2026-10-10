import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema(
  {
    heroBanner: { type: String, default: '' },
    promoBanner1: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Banner = mongoose.model('Banner', bannerSchema);

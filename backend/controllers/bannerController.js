import { Banner } from '../models/Banner.js';

export const getBanners = async (req, res) => {
  try {
    const bannerDoc = await Banner.findOne().sort({ updatedAt: -1 }).lean();
    if (bannerDoc) {
      return res.json({
        heroBanner: bannerDoc.heroBanner || '',
        promoBanner1: bannerDoc.promoBanner1 || '',
      });
    }

    return res.json({ heroBanner: '', promoBanner1: '' });
  } catch (error) {
    console.error('[Banner Controller Error - getBanners]:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch site banners' });
  }
};

export const updateBanners = async (req, res) => {
  try {
    let bannerDoc = await Banner.findOne();
    if (!bannerDoc) {
      bannerDoc = await Banner.create(req.body);
    } else {
      Object.assign(bannerDoc, req.body);
      await bannerDoc.save();
    }

    return res.json({
      heroBanner: bannerDoc.heroBanner || '',
      promoBanner1: bannerDoc.promoBanner1 || '',
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

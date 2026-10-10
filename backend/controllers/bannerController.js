import { Banner } from '../models/Banner.js';

let IN_MEMORY_BANNERS = { heroBanner: '', promoBanner1: '' };

export const getBanners = async (req, res) => {
  try {
    const bannerDoc = await Banner.findOne().sort({ updatedAt: -1 });
    if (bannerDoc) {
      return res.json({
        heroBanner: bannerDoc.heroBanner || '',
        promoBanner1: bannerDoc.promoBanner1 || '',
      });
    }
    return res.json(IN_MEMORY_BANNERS);
  } catch (error) {
    return res.json(IN_MEMORY_BANNERS);
  }
};

export const updateBanners = async (req, res) => {
  IN_MEMORY_BANNERS = { ...IN_MEMORY_BANNERS, ...req.body };
  try {
    let bannerDoc = await Banner.findOne();
    if (!bannerDoc) {
      bannerDoc = new Banner(req.body);
    } else {
      Object.assign(bannerDoc, req.body);
    }
    await bannerDoc.save();
    return res.json({
      heroBanner: bannerDoc.heroBanner || '',
      promoBanner1: bannerDoc.promoBanner1 || '',
    });
  } catch (dbErr) {
    return res.json(IN_MEMORY_BANNERS);
  }
};

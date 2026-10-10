import { Banner } from '../models/Banner.js';
import { getStore, saveStore } from '../config/store.js';

export const getBanners = async (req, res) => {
  try {
    try {
      const bannerDoc = await Banner.findOne().sort({ updatedAt: -1 });
      if (bannerDoc) {
        return res.json({
          heroBanner: bannerDoc.heroBanner || '',
          promoBanner1: bannerDoc.promoBanner1 || '',
        });
      }
    } catch (e) {}

    const store = getStore();
    return res.json(store.banners || { heroBanner: '', promoBanner1: '' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBanners = async (req, res) => {
  try {
    try {
      let bannerDoc = await Banner.findOne();
      if (!bannerDoc) {
        bannerDoc = new Banner(req.body);
      } else {
        Object.assign(bannerDoc, req.body);
      }
      await bannerDoc.save();
    } catch (dbErr) {}

    const store = getStore();
    store.banners = { ...store.banners, ...req.body };
    saveStore(store);

    return res.json(store.banners);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

import express from 'express';
import { getBanners, updateBanners } from '../controllers/bannerController.js';

import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getBanners);
router.post('/', protect, adminOnly, updateBanners);
router.put('/', protect, adminOnly, updateBanners);

export default router;

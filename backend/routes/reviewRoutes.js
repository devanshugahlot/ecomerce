import express from 'express';
import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  getAllReviews,
} from '../controllers/reviewController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/reviews', protect, adminOnly, getAllReviews);
router.post('/reviews', protect, createReview);
router.get('/products/:productId/reviews', getProductReviews);
router.post('/products/:productId/reviews', protect, createReview);
router.put('/reviews/:id', protect, updateReview);
router.delete('/reviews/:id', protect, deleteReview);

export default router;

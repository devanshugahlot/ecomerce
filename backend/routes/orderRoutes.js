import express from 'express';
import { createOrder, getOrders, getMyOrders, getOrderByNumber, updateOrderStatus } from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/track/:orderNumber', protect, getOrderByNumber);
router.get('/', protect, adminOnly, getOrders);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

export default router;

import express from 'express';
import { createRazorpayOrder, verifyRazorpaySignature } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/create', createRazorpayOrder);
router.post('/verify', verifyRazorpaySignature);

export default router;

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import bannerRoutes from './routes/bannerRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

dotenv.config();

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter);

// Root Endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    brand: 'Hypril REST API',
    health: '/api/health',
    timestamp: new Date(),
  });
});

// Health Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    brand: 'Hypril Men\'s Wellness',
    timestamp: new Date(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api', reviewRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Backend Error]', err);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[Hypril Server] REST API running at http://localhost:${PORT}/api`);
  });
});

import mongoose from 'mongoose';
import { Coupon } from '../models/Coupon.js';

export const validateCoupon = async (req, res) => {
  try {
    const couponInput = req.body.code || req.body.couponCode;
    const subtotal = Number(req.body.cartSubtotal || req.body.orderAmount || 0);
    const userId = req.user ? req.user.id : null;

    if (!couponInput) {
      return res.status(400).json({ message: 'Coupon code is required' });
    }

    const uppercaseCode = couponInput.trim().toUpperCase();

    const coupon = await Coupon.findOne({ code: uppercaseCode, isActive: true });
    if (!coupon) {
      return res.status(404).json({ message: `Coupon '${uppercaseCode}' is invalid or inactive` });
    }

    // Check expiration
    if (coupon.expirationDate && new Date(coupon.expirationDate) < new Date()) {
      return res.status(400).json({ message: `Coupon '${coupon.code}' has expired` });
    }

    // Check global usage limit
    if (coupon.usageLimit && (coupon.usedCount || 0) >= coupon.usageLimit) {
      return res.status(400).json({ message: `Coupon '${coupon.code}' usage limit has been reached` });
    }

    // Check per-user limit
    if (userId && coupon.usersUsed && coupon.usersUsed.includes(userId.toString())) {
      return res.status(400).json({ message: `You have already used coupon '${coupon.code}'` });
    }

    // Check minimum order subtotal
    const minOrder = Number(coupon.minOrderAmount || 0);
    if (subtotal < minOrder) {
      return res.status(400).json({
        message: `Coupon '${coupon.code}' requires a minimum order value of ₹${minOrder}`,
      });
    }

    // Calculate discount amount
    let discountAmount = 0;
    const discountVal = Number(coupon.discountValue);
    const maxDiscount = Number(coupon.maxDiscountAmount || 1000);

    if (coupon.discountType === 'percentage') {
      discountAmount = Math.min((subtotal * discountVal) / 100, maxDiscount);
    } else {
      discountAmount = Math.min(discountVal, subtotal);
    }

    discountAmount = Math.round(discountAmount * 100) / 100;

    res.json({
      success: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrderAmount: coupon.minOrderAmount,
        maxDiscountAmount: coupon.maxDiscountAmount,
        discountAmount,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error validating coupon' });
  }
};

export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
    return res.json(coupons);
  } catch (error) {
    console.error('[Coupon Controller Error - getCoupons]:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch coupons' });
  }
};

export const createCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, minOrderAmount, maxDiscountAmount, usageLimit, expirationDate } = req.body;

    if (!code || discountValue === undefined) {
      return res.status(400).json({ message: 'Coupon code and discount value are required' });
    }

    const uppercaseCode = code.trim().toUpperCase();
    const existing = await Coupon.findOne({ code: uppercaseCode });
    if (existing) {
      return res.status(400).json({ message: `Coupon with code '${uppercaseCode}' already exists` });
    }

    const coupon = await Coupon.create({
      code: uppercaseCode,
      discountType: discountType || 'percentage',
      discountValue: Number(discountValue),
      minOrderAmount: Number(minOrderAmount) || 0,
      maxDiscountAmount: Number(maxDiscountAmount) || 1000,
      usageLimit: Number(usageLimit) || 1000,
      expirationDate: expirationDate ? new Date(expirationDate) : null,
    });

    return res.status(201).json(coupon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const toggleCoupon = async (req, res) => {
  try {
    const id = req.params.id;
    const query = [{ code: id.toUpperCase() }];
    if (mongoose.isValidObjectId(id)) {
      query.push({ _id: id });
    }

    const coupon = await Coupon.findOne({ $or: query });
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    coupon.isActive = !coupon.isActive;
    await coupon.save();
    return res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const id = req.params.id;
    const query = [{ code: id.toUpperCase() }];
    if (mongoose.isValidObjectId(id)) {
      query.push({ _id: id });
    }

    const deleted = await Coupon.findOneAndDelete({ $or: query });
    if (!deleted) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    res.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

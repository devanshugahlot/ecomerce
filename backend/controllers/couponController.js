import { Coupon } from '../models/Coupon.js';
import { getStore, saveStore } from '../config/store.js';

export const validateCoupon = async (req, res) => {
  try {
    const { code, cartSubtotal } = req.body;
    const userId = req.user ? req.user.id : null;

    if (!code) {
      return res.status(400).json({ message: 'Coupon code is required' });
    }

    const uppercaseCode = code.trim().toUpperCase();

    let coupon = null;
    try {
      coupon = await Coupon.findOne({ code: uppercaseCode, isActive: true });
    } catch (e) {
      coupon = null;
    }

    if (!coupon) {
      const store = getStore();
      coupon = store.coupons.find((c) => c.code === uppercaseCode && c.isActive);
    }

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
    if (userId && coupon.usersUsed && coupon.usersUsed.includes(userId)) {
      return res.status(400).json({ message: `You have already used coupon '${coupon.code}'` });
    }

    // Check minimum order subtotal
    const subtotal = Number(cartSubtotal || 0);
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
    try {
      const coupons = await Coupon.find().sort({ createdAt: -1 });
      if (coupons && coupons.length > 0) return res.json(coupons);
    } catch (e) {}

    const store = getStore();
    return res.json(store.coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, minOrderAmount, maxDiscountAmount, usageLimit, expirationDate } = req.body;
    if (!code || discountValue === undefined) {
      return res.status(400).json({ message: 'Coupon code and discount value are required' });
    }

    const uppercaseCode = code.trim().toUpperCase();

    try {
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
    } catch (dbErr) {
      const store = getStore();
      const newCoup = {
        _id: 'coup_' + Date.now(),
        code: uppercaseCode,
        discountType: discountType || 'percentage',
        discountValue: Number(discountValue),
        minOrderAmount: Number(minOrderAmount) || 0,
        maxDiscountAmount: Number(maxDiscountAmount) || 1000,
        usageLimit: Number(usageLimit) || 1000,
        usedCount: 0,
        usersUsed: [],
        expirationDate: expirationDate || null,
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      store.coupons.unshift(newCoup);
      saveStore(store);
      return res.status(201).json(newCoup);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const toggleCoupon = async (req, res) => {
  try {
    const id = req.params.id;
    try {
      const coupon = await Coupon.findById(id);
      if (coupon) {
        coupon.isActive = !coupon.isActive;
        await coupon.save();
        return res.json(coupon);
      }
    } catch (e) {}

    const store = getStore();
    const idx = store.coupons.findIndex((c) => c._id === id || c.id === id);
    if (idx > -1) {
      store.coupons[idx].isActive = !store.coupons[idx].isActive;
      saveStore(store);
      return res.json(store.coupons[idx]);
    }

    res.status(404).json({ message: 'Coupon not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const id = req.params.id;
    try {
      await Coupon.findByIdAndDelete(id);
    } catch (e) {}

    const store = getStore();
    store.coupons = store.coupons.filter((c) => c._id !== id && c.id !== id);
    saveStore(store);

    res.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

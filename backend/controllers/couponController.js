import { Coupon } from '../models/Coupon.js';

let inMemoryCoupons = [
  { _id: 'coup_1', code: 'HYPRIL10', discountType: 'percentage', discountValue: 10, minOrderAmount: 0, isActive: true },
  { _id: 'coup_2', code: 'BOLD10', discountType: 'percentage', discountValue: 10, minOrderAmount: 0, isActive: true },
  { _id: 'coup_3', code: 'VYRO10', discountType: 'percentage', discountValue: 10, minOrderAmount: 0, isActive: true },
  { _id: 'coup_4', code: 'WELLNESS200', discountType: 'fixed', discountValue: 200, minOrderAmount: 999, isActive: true }
];

export const validateCoupon = async (req, res) => {
  try {
    const { code, cartSubtotal } = req.body;
    if (!code) {
      return res.status(400).json({ message: 'Coupon code is required' });
    }

    const uppercaseCode = code.trim().toUpperCase();

    let coupon;
    try {
      coupon = await Coupon.findOne({ code: uppercaseCode, isActive: true });
    } catch (e) {
      coupon = null;
    }

    if (!coupon) {
      coupon = inMemoryCoupons.find((c) => c.code === uppercaseCode && c.isActive);
    }

    if (!coupon) {
      return res.status(404).json({ message: 'Invalid or expired coupon code' });
    }

    if (cartSubtotal !== undefined && cartSubtotal < (coupon.minOrderAmount || 0)) {
      return res.status(400).json({
        message: `Coupon '${coupon.code}' requires a minimum order value of ₹${coupon.minOrderAmount}`,
      });
    }

    res.json({
      success: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrderAmount: coupon.minOrderAmount,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error validating coupon' });
  }
};

export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    if (coupons && coupons.length > 0) return res.json(coupons);
    res.json(inMemoryCoupons);
  } catch (error) {
    res.json(inMemoryCoupons);
  }
};

export const createCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, minOrderAmount } = req.body;
    const uppercaseCode = code.trim().toUpperCase();

    try {
      const coupon = await Coupon.create({
        code: uppercaseCode,
        discountType: discountType || 'percentage',
        discountValue: Number(discountValue),
        minOrderAmount: Number(minOrderAmount) || 0,
      });
      return res.status(201).json(coupon);
    } catch (dbErr) {
      const newCoup = {
        _id: 'coup_' + Date.now(),
        code: uppercaseCode,
        discountType: discountType || 'percentage',
        discountValue: Number(discountValue),
        minOrderAmount: Number(minOrderAmount) || 0,
        isActive: true,
      };
      inMemoryCoupons.unshift(newCoup);
      return res.status(201).json(newCoup);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const id = req.params.id;
    try {
      await Coupon.findByIdAndDelete(id);
    } catch (e) {
      inMemoryCoupons = inMemoryCoupons.filter((c) => c._id !== id);
    }
    res.json({ message: 'Coupon deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


import mongoose from 'mongoose';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { Coupon } from '../models/Coupon.js';

export const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, couponCode } = req.body;

    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items in cart' });
    }

    const line1 = shippingAddress?.line1 || shippingAddress?.addressLine || shippingAddress?.address;
    const postalCode = shippingAddress?.postalCode || shippingAddress?.pincode || shippingAddress?.zip;
    const fullName = shippingAddress?.fullName || shippingAddress?.name;

    if (!shippingAddress || !fullName || !line1 || !postalCode) {
      return res.status(400).json({ message: 'Complete shipping address is required' });
    }

    const userId = req.user ? req.user.id : null;

    // Deduplicate rapid parallel requests (double-click prevention)
    if (userId) {
      const recentOrder = await Order.findOne({
        user: userId,
        createdAt: { $gte: new Date(Date.now() - 3000) },
      });
      if (recentOrder) {
        return res.status(200).json({ success: true, order: recentOrder });
      }
    }

    let itemsPrice = 0;
    const verifiedOrderItems = [];
    const decrementedItems = [];

    // Atomic Stock Verification & Decrement
    for (const item of orderItems) {
      const pId = item.productId || item.product || item._id || item.id;
      const qty = Math.max(1, Number(item.quantity || 1));

      const query = [{ slug: pId }];
      if (mongoose.isValidObjectId(pId)) {
        query.push({ _id: pId });
      }

      const dbProd = await Product.findOne({ $or: query });
      if (!dbProd) {
        // Rollback decrements
        for (const dec of decrementedItems) {
          await Product.findByIdAndUpdate(dec.productId, { $inc: { stock: dec.quantity } });
        }
        return res.status(400).json({ message: `Product '${item.name || pId}' not found` });
      }

      if (dbProd.stock < qty) {
        for (const dec of decrementedItems) {
          await Product.findByIdAndUpdate(dec.productId, { $inc: { stock: dec.quantity } });
        }
        return res.status(400).json({ message: `Insufficient stock for product '${dbProd.name}'` });
      }

      // Atomic decrement: stock must be >= qty
      const updatedProd = await Product.findOneAndUpdate(
        { _id: dbProd._id, stock: { $gte: qty } },
        { $inc: { stock: -qty } },
        { new: true }
      );

      if (!updatedProd) {
        for (const dec of decrementedItems) {
          await Product.findByIdAndUpdate(dec.productId, { $inc: { stock: dec.quantity } });
        }
        return res.status(400).json({ message: `Insufficient stock for product '${dbProd.name}'` });
      }

      decrementedItems.push({ productId: dbProd._id, quantity: qty });
      const unitPrice = Number(dbProd.price);
      itemsPrice += unitPrice * qty;

      verifiedOrderItems.push({
        name: dbProd.name,
        quantity: qty,
        image: dbProd.images && dbProd.images[0] ? dbProd.images[0] : dbProd.image,
        price: unitPrice,
        product: dbProd._id,
      });
    }

    // Shipping Fee
    const shippingPrice = itemsPrice > 799 || itemsPrice === 0 ? 0 : 79;

    // Coupon Validation & Discount
    let discountAmount = 0;
    if (couponCode) {
      const uppercaseCode = couponCode.trim().toUpperCase();
      const couponDoc = await Coupon.findOne({ code: uppercaseCode, isActive: true });

      if (couponDoc && itemsPrice >= (couponDoc.minOrderAmount || 0)) {
        if (couponDoc.discountType === 'percentage') {
          discountAmount = Math.min((itemsPrice * couponDoc.discountValue) / 100, couponDoc.maxDiscountAmount || 1000);
        } else {
          discountAmount = Math.min(couponDoc.discountValue, itemsPrice);
        }
        discountAmount = Math.round(discountAmount * 100) / 100;

        await Coupon.findByIdAndUpdate(couponDoc._id, {
          $inc: { usedCount: 1 },
          $addToSet: { usersUsed: userId ? userId.toString() : '' },
        });
      }
    }

    const totalPrice = Math.max(0, Math.round((itemsPrice + shippingPrice - discountAmount) * 100) / 100);

    // Retry loop for collision-safe unique HYP- Order ID
    let savedOrder = null;
    let attempts = 0;

    while (!savedOrder && attempts < 10) {
      attempts++;
      const randNo = Math.floor(100000 + Math.random() * 900000);
      const orderNumber = `HYP-${randNo}`;

      try {
        const order = new Order({
          orderNumber,
          user: userId,
          orderItems: verifiedOrderItems,
          shippingAddress: {
            fullName,
            phone: shippingAddress.phone || '',
            line1,
            city: shippingAddress.city || '',
            postalCode,
          },
          paymentMethod: paymentMethod || 'COD',
          itemsPrice,
          shippingPrice,
          discountAmount,
          totalPrice,
          couponCode: couponCode || null,
          isPaid: paymentMethod !== 'COD',
          paidAt: paymentMethod !== 'COD' ? new Date() : null,
          status: 'Confirmed',
          trackingNumber: `EXP-${randNo}IN`,
        });
        savedOrder = await order.save();
      } catch (err) {
        if (err.code === 11000 && err.keyPattern && err.keyPattern.orderNumber) {
          continue;
        }
        // Rollback stock if order saving failed
        for (const dec of decrementedItems) {
          await Product.findByIdAndUpdate(dec.productId, { $inc: { stock: dec.quantity } });
        }
        throw err;
      }
    }

    if (!savedOrder) {
      for (const dec of decrementedItems) {
        await Product.findByIdAndUpdate(dec.productId, { $inc: { stock: dec.quantity } });
      }
      return res.status(500).json({ message: 'Failed to generate unique Order ID after retries' });
    }

    return res.status(201).json({ success: true, order: savedOrder });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error creating order' });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user orders' });
  }
};

export const getOrderByNumber = async (req, res) => {
  try {
    const orderNumber = req.params.orderNumber;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    const query = [{ orderNumber: orderNumber }];
    if (mongoose.isValidObjectId(orderNumber)) {
      query.push({ _id: orderNumber });
    }

    const order = await Order.findOne({ $or: query });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // IDOR Check: Ensure order belongs to logged-in user or user is admin
    if (!isAdmin && order.user && order.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Forbidden: Access denied to this order' });
    }

    return res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber } = req.body;
    const id = req.params.id;

    const query = [{ orderNumber: id }];
    if (mongoose.isValidObjectId(id)) {
      query.push({ _id: id });
    }

    const order = await Order.findOne({ $or: query });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const oldStatus = order.status;
    if (status) order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    const updated = await order.save();

    // If cancelled, restore stock exactly once
    if (status === 'Cancelled' && oldStatus !== 'Cancelled') {
      for (const item of order.orderItems || []) {
        if (item.product) {
          await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
        }
      }

      if (order.couponCode) {
        await Coupon.findOneAndUpdate(
          { code: order.couponCode.toUpperCase() },
          { $inc: { usedCount: -1 }, $pull: { usersUsed: order.user ? order.user.toString() : '' } }
        );
      }
    }

    return res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

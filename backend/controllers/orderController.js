import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { Coupon } from '../models/Coupon.js';
import { getStore, saveStore } from '../config/store.js';

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

    // Server-side authoritative price & stock verification
    let itemsPrice = 0;
    const verifiedOrderItems = [];
    const store = getStore();

    for (const item of orderItems) {
      const pId = item.productId || item.product || item._id || item.id;
      let dbProd = null;

      try {
        dbProd = await Product.findById(pId);
      } catch (e) {}

      if (!dbProd) {
        dbProd = store.products.find((p) => p._id === pId || p.id === pId);
      }

      const unitPrice = dbProd ? Number(dbProd.price) : Number(item.price || 0);
      const qty = Math.max(1, Number(item.quantity || 1));
      itemsPrice += unitPrice * qty;

      verifiedOrderItems.push({
        name: dbProd ? dbProd.name : item.name,
        quantity: qty,
        image: dbProd ? (dbProd.images ? dbProd.images[0] : dbProd.image) : item.image,
        price: unitPrice,
        product: dbProd ? dbProd._id : pId,
      });

      // Stock check & decrement
      if (dbProd) {
        if (dbProd.stock < qty) {
          return res.status(400).json({ message: `Insufficient stock for product '${dbProd.name}'` });
        }
        dbProd.stock = Math.max(0, dbProd.stock - qty);
        try {
          await Product.findByIdAndUpdate(dbProd._id, { stock: dbProd.stock });
        } catch (e) {}
      }
    }

    // Shipping fee
    const shippingPrice = itemsPrice > 799 || itemsPrice === 0 ? 0 : 79;

    // Server-side coupon discount calculation
    let discountAmount = 0;
    if (couponCode) {
      const codeUpper = couponCode.trim().toUpperCase();
      let couponDoc = null;
      try {
        couponDoc = await Coupon.findOne({ code: codeUpper, isActive: true });
      } catch (e) {}

      if (!couponDoc) {
        couponDoc = store.coupons.find((c) => c.code === codeUpper && c.isActive);
      }

      if (couponDoc && itemsPrice >= (couponDoc.minOrderAmount || 0)) {
        if (couponDoc.discountType === 'percentage') {
          discountAmount = Math.min((itemsPrice * couponDoc.discountValue) / 100, couponDoc.maxDiscountAmount || 1000);
        } else {
          discountAmount = Math.min(couponDoc.discountValue, itemsPrice);
        }
        discountAmount = Math.round(discountAmount * 100) / 100;

        // Record coupon usage
        try {
          await Coupon.findByIdAndUpdate(couponDoc._id, {
            $inc: { usedCount: 1 },
            $addToSet: { usersUsed: userId },
          });
        } catch (e) {}
        couponDoc.usedCount = (couponDoc.usedCount || 0) + 1;
        if (userId && couponDoc.usersUsed && !couponDoc.usersUsed.includes(userId)) {
          couponDoc.usersUsed.push(userId);
        }
      }
    }

    const totalPrice = Math.max(0, Math.round((itemsPrice + shippingPrice - discountAmount) * 100) / 100);
    const dateStamp = Date.now().toString().slice(-6);
    const orderNumber = 'HYP-' + dateStamp;

    let savedOrder;
    try {
      const order = new Order({
        orderNumber,
        user: userId,
        orderItems: verifiedOrderItems,
        shippingAddress,
        paymentMethod: paymentMethod || 'COD',
        itemsPrice,
        shippingPrice,
        discountAmount,
        totalPrice,
        isPaid: paymentMethod !== 'COD',
        paidAt: paymentMethod !== 'COD' ? new Date() : null,
        status: 'Confirmed',
        trackingNumber: 'EXP-' + dateStamp + 'IN',
      });
      savedOrder = await order.save();
    } catch (dbErr) {
      // Disk store fallback
      savedOrder = {
        _id: 'ord_' + Date.now(),
        orderNumber,
        user: userId,
        orderItems: verifiedOrderItems,
        shippingAddress,
        paymentMethod: paymentMethod || 'COD',
        itemsPrice,
        shippingPrice,
        discountAmount,
        totalPrice,
        isPaid: paymentMethod !== 'COD',
        paidAt: paymentMethod !== 'COD' ? new Date() : null,
        status: 'Confirmed',
        trackingNumber: 'EXP-' + dateStamp + 'IN',
        createdAt: new Date().toISOString(),
      };
      store.orders.unshift(savedOrder);
      saveStore(store);
    }

    // Save updated stock to disk store
    saveStore(store);

    return res.status(201).json({ success: true, order: savedOrder });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error creating order' });
  }
};

export const getOrders = async (req, res) => {
  try {
    try {
      const orders = await Order.find().sort({ createdAt: -1 });
      if (orders && orders.length > 0) return res.json(orders);
    } catch (e) {}

    const store = getStore();
    return res.json(store.orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    try {
      const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
      if (orders && orders.length > 0) return res.json(orders);
    } catch (e) {}

    const store = getStore();
    const userOrders = store.orders.filter(
      (o) => (o.user && o.user.toString() === userId.toString()) || o.user === userId
    );

    return res.json(userOrders);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user orders' });
  }
};

export const getOrderByNumber = async (req, res) => {
  try {
    const orderNumber = req.params.orderNumber;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    let order = null;
    try {
      order = await Order.findOne({
        $or: [{ orderNumber: orderNumber }, { _id: orderNumber }],
      });
    } catch (e) {}

    if (!order) {
      const store = getStore();
      order = store.orders.find(
        (o) => o.orderNumber === orderNumber || o._id === orderNumber || o.id === orderNumber
      );
    }

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

    let updatedOrder = null;

    try {
      const existing = await Order.findById(id);
      if (existing) {
        const oldStatus = existing.status;
        existing.status = status || existing.status;
        existing.trackingNumber = trackingNumber || existing.trackingNumber;
        updatedOrder = await existing.save();

        // If cancelled, restore stock!
        if (status === 'Cancelled' && oldStatus !== 'Cancelled') {
          for (const item of existing.orderItems) {
            if (item.product) {
              await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
            }
          }
        }
        return res.json(updatedOrder);
      }
    } catch (e) {}

    // Store fallback
    const store = getStore();
    const idx = store.orders.findIndex((o) => o._id === id || o.id === id || o.orderNumber === id);
    if (idx > -1) {
      const oldStatus = store.orders[idx].status;
      store.orders[idx].status = status || store.orders[idx].status;
      store.orders[idx].trackingNumber = trackingNumber || store.orders[idx].trackingNumber;

      // Restore stock if cancelled
      if (status === 'Cancelled' && oldStatus !== 'Cancelled') {
        for (const item of store.orders[idx].orderItems || []) {
          const pId = item.product || item.productId;
          const pIdx = store.products.findIndex((p) => p._id === pId || p.id === pId);
          if (pIdx > -1) {
            store.products[pIdx].stock += item.quantity || 1;
          }
        }
      }

      saveStore(store);
      return res.json(store.orders[idx]);
    }

    res.status(404).json({ message: 'Order not found' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

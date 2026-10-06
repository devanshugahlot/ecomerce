import { Order } from '../models/Order.js';

let inMemoryOrders = [];

export const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, discountAmount, totalPrice } = req.body;

    const orderNumber = 'HYPRIL-' + Date.now().toString().slice(-6);

    try {
      const order = new Order({
        orderNumber,
        user: req.user ? req.user.id : null,
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        discountAmount,
        totalPrice,
        isPaid: paymentMethod !== 'COD',
        paidAt: paymentMethod !== 'COD' ? new Date() : null,
        status: 'Confirmed',
      });
      const saved = await order.save();
      return res.status(201).json({ success: true, order: saved });
    } catch (dbErr) {
      // In-memory fallback if DB not connected
      const mockOrder = {
        _id: 'order_' + Date.now(),
        orderNumber,
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        discountAmount,
        totalPrice,
        isPaid: paymentMethod !== 'COD',
        paidAt: paymentMethod !== 'COD' ? new Date() : null,
        status: 'Confirmed',
        trackingNumber: 'Pending',
        createdAt: new Date(),
      };
      inMemoryOrders.unshift(mockOrder);
      return res.status(201).json({ success: true, order: mockOrder });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error creating order' });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    if (orders && orders.length > 0) return res.json(orders);
    res.json(inMemoryOrders);
  } catch (error) {
    res.json(inMemoryOrders);
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.json(inMemoryOrders);
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber } = req.body;
    try {
      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status, trackingNumber },
        { new: true }
      );
      if (order) return res.json(order);
    } catch (dbErr) {
      // In-memory update
      const idx = inMemoryOrders.findIndex((o) => o._id === req.params.id || o.orderNumber === req.params.id);
      if (idx > -1) {
        inMemoryOrders[idx].status = status || inMemoryOrders[idx].status;
        inMemoryOrders[idx].trackingNumber = trackingNumber || inMemoryOrders[idx].trackingNumber;
        return res.json(inMemoryOrders[idx]);
      }
    }

    const idx = inMemoryOrders.findIndex((o) => o._id === req.params.id || o.orderNumber === req.params.id);
    if (idx > -1) {
      inMemoryOrders[idx].status = status || inMemoryOrders[idx].status;
      inMemoryOrders[idx].trackingNumber = trackingNumber || inMemoryOrders[idx].trackingNumber;
      return res.json(inMemoryOrders[idx]);
    }

    res.status(404).json({ message: 'Order not found' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_PRODUCTS as INITIAL_PRODUCTS } from '../utils/mockProducts';

const ProductContext = createContext();

const INITIAL_COUPONS = [
  { _id: 'coup_1', id: 'coup_1', code: 'HYPRIL10', discountType: 'percentage', discountValue: 10, minOrderAmount: 0, isActive: true },
  { _id: 'coup_2', id: 'coup_2', code: 'BOLD10', discountType: 'percentage', discountValue: 10, minOrderAmount: 0, isActive: true },
  { _id: 'coup_3', id: 'coup_3', code: 'VYRO10', discountType: 'percentage', discountValue: 10, minOrderAmount: 0, isActive: true },
  { _id: 'coup_4', id: 'coup_4', code: 'WELLNESS200', discountType: 'fixed', discountValue: 200, minOrderAmount: 999, isActive: true }
];

const INITIAL_ORDERS = [
  {
    _id: 'ord_101',
    orderNumber: 'HYPRIL-849201',
    createdAt: new Date().toISOString(),
    customer: { name: 'Vikram Rao', email: 'user@hypril.com', phone: '+91 9876543211' },
    orderItems: [
      { name: 'Hypril™ Enlargement Oil (100 ml)', quantity: 1, price: 799, image: '/images/hypril_oil.jpg' }
    ],
    totalPrice: 799,
    status: 'Delivered',
    paymentMethod: 'UPI'
  },
  {
    _id: 'ord_102',
    orderNumber: 'HYPRIL-938210',
    createdAt: new Date().toISOString(),
    customer: { name: 'Rohan Sharma', email: 'rohan@gmail.com', phone: '+91 9988776655' },
    orderItems: [
      { name: 'Hypril™ Extended Delay Gel (50 ml)', quantity: 2, price: 699, image: '/images/hypril_delay_gel.jpg' }
    ],
    totalPrice: 1398,
    status: 'Shipped',
    paymentMethod: 'COD'
  }
];

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('hypril_products');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_PRODUCTS;
  });

  const [coupons, setCoupons] = useState(() => {
    const saved = localStorage.getItem('hypril_coupons');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_COUPONS;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('hypril_orders');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_ORDERS;
  });

  useEffect(() => {
    localStorage.setItem('hypril_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('hypril_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('hypril_orders', JSON.stringify(orders));
  }, [orders]);

  // Product CRUD
  const addProduct = (newProd) => {
    const id = 'prod_' + Date.now();
    const productToAdd = {
      _id: id,
      id: id,
      rating: 4.9,
      reviewCount: 1,
      isBestSeller: true,
      isFeatured: true,
      isRx: false,
      images: [newProd.image || '/images/hypril_oil.jpg'],
      packs: [{ name: 'Standard Pack', price: Number(newProd.price), comparePrice: Number(newProd.comparePrice || newProd.price * 1.5), savings: '20% OFF' }],
      benefits: ['High Potency Herbal Formula', '100% Skin Safe', 'Fast Acting'],
      ingredients: newProd.ingredients || 'Herbal Active Extracts, Natural Oils.',
      usage: newProd.usage || 'Apply as directed daily.',
      ...newProd,
      price: Number(newProd.price),
      comparePrice: Number(newProd.comparePrice || newProd.price * 1.5),
      stock: Number(newProd.stock || 50),
    };
    setProducts((prev) => [productToAdd, ...prev]);
    return productToAdd;
  };

  const updateProduct = (id, updatedData) => {
    setProducts((prev) =>
      prev.map((p) => (p._id === id || p.id === id ? { ...p, ...updatedData } : p))
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p._id !== id && p.id !== id));
  };

  // Coupon CRUD
  const addCoupon = (newCoupon) => {
    const id = 'coup_' + Date.now();
    const couponToAdd = {
      _id: id,
      id: id,
      isActive: true,
      minOrderAmount: Number(newCoupon.minOrderAmount || 0),
      discountValue: Number(newCoupon.discountValue || 10),
      discountType: newCoupon.discountType || 'percentage',
      code: newCoupon.code.toUpperCase(),
      ...newCoupon
    };
    setCoupons((prev) => [couponToAdd, ...prev]);
    return couponToAdd;
  };

  const toggleCouponStatus = (id) => {
    setCoupons((prev) =>
      prev.map((c) => (c._id === id || c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const deleteCoupon = (id) => {
    setCoupons((prev) => prev.filter((c) => c._id !== id && c.id !== id));
  };

  // Order CRUD
  const addOrder = (newOrder) => {
    const id = 'ord_' + Date.now();
    const orderToAdd = {
      _id: id,
      orderNumber: 'HYPRIL-' + Date.now().toString().slice(-6),
      createdAt: new Date().toISOString(),
      status: 'Confirmed',
      ...newOrder
    };
    setOrders((prev) => [orderToAdd, ...prev]);
    return orderToAdd;
  };

  const updateOrderStatus = (id, status) => {
    setOrders((prev) =>
      prev.map((o) => (o._id === id || o.id === id ? { ...o, status } : o))
    );
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        coupons,
        addCoupon,
        toggleCouponStatus,
        deleteCoupon,
        orders,
        addOrder,
        updateOrderStatus
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

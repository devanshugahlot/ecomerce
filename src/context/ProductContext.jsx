import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [siteBanners, setSiteBanners] = useState({ heroBanner: '', promoBanner1: '' });
  const [coupons, setCoupons] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch live backend data
  const fetchBackendData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes, banRes, coupRes, ordRes, revRes] = await Promise.allSettled([
        api.get('/products'),
        api.get('/categories'),
        api.get('/banners'),
        api.get('/coupons'),
        api.get('/orders'),
        api.get('/reviews'),
      ]);

      if (prodRes.status === 'fulfilled' && Array.isArray(prodRes.value.data)) {
        setProducts(prodRes.value.data);
      }
      if (catRes.status === 'fulfilled' && Array.isArray(catRes.value.data)) {
        setCategories(catRes.value.data);
      }
      if (banRes.status === 'fulfilled' && banRes.value.data && typeof banRes.value.data === 'object') {
        setSiteBanners(banRes.value.data);
      }
      if (coupRes.status === 'fulfilled' && Array.isArray(coupRes.value.data)) {
        setCoupons(coupRes.value.data);
      }
      if (ordRes.status === 'fulfilled' && Array.isArray(ordRes.value.data)) {
        setOrders(ordRes.value.data);
      }
      if (revRes.status === 'fulfilled' && Array.isArray(revRes.value.data)) {
        setReviews(revRes.value.data);
      }
    } catch (err) {
      console.warn('Backend data load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackendData();
  }, []);

  // Category CRUD
  const addCategory = async (newCat) => {
    try {
      const res = await api.post('/categories', newCat);
      if (res.data) {
        setCategories((prev) => [res.data, ...prev]);
        return res.data;
      }
    } catch (err) {
      console.error('Category creation failed:', err);
    }
  };

  const updateCategory = async (id, updatedData) => {
    try {
      const res = await api.put(`/categories/${id}`, updatedData);
      if (res.data) {
        setCategories((prev) =>
          prev.map((c) => (c._id === id || c.id === id ? { ...c, ...res.data } : c))
        );
      }
    } catch (err) {
      console.error('Category update failed:', err);
    }
  };

  const deleteCategory = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c._id !== id && c.id !== id));
    } catch (err) {
      console.error('Category delete failed:', err);
    }
  };

  // Banner Updates
  const updateSiteBanners = async (newBanners) => {
    try {
      const res = await api.put('/banners', newBanners);
      if (res.data) {
        setSiteBanners(res.data);
      }
    } catch (err) {
      console.error('Banners update failed:', err);
    }
  };

  // Product CRUD
  const addProduct = async (newProd) => {
    try {
      const res = await api.post('/products', newProd);
      if (res.data) {
        setProducts((prev) => [res.data, ...prev]);
        return res.data;
      }
    } catch (err) {
      console.error('Product add failed:', err);
    }
  };

  const updateProduct = async (id, updatedData) => {
    try {
      const res = await api.put(`/products/${id}`, updatedData);
      if (res.data) {
        setProducts((prev) =>
          prev.map((p) => (p._id === id || p.id === id ? { ...p, ...res.data } : p))
        );
      }
    } catch (err) {
      console.error('Product update failed:', err);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id && p.id !== id));
    } catch (err) {
      console.error('Product delete failed:', err);
    }
  };

  // Coupon CRUD
  const addCoupon = async (newCoupon) => {
    try {
      const res = await api.post('/coupons', newCoupon);
      if (res.data) {
        setCoupons((prev) => [res.data, ...prev]);
        return res.data;
      }
    } catch (err) {
      console.error('Coupon creation failed:', err);
    }
  };

  const toggleCouponStatus = async (id) => {
    try {
      const res = await api.put(`/coupons/${id}/toggle`);
      if (res.data) {
        setCoupons((prev) =>
          prev.map((c) => (c._id === id || c.id === id ? { ...c, ...res.data } : c))
        );
      }
    } catch (err) {
      console.error('Coupon toggle failed:', err);
    }
  };

  const deleteCoupon = async (id) => {
    try {
      await api.delete(`/coupons/${id}`);
      setCoupons((prev) => prev.filter((c) => c._id !== id && c.id !== id));
    } catch (err) {
      console.error('Coupon delete failed:', err);
    }
  };

  // Order Status Updates for Admin
  const updateOrderStatus = async (id, status, trackingNumber) => {
    try {
      const res = await api.put(`/orders/${id}/status`, { status, trackingNumber });
      if (res.data) {
        setOrders((prev) =>
          prev.map((o) => (o._id === id || o.id === id || o.orderNumber === id ? { ...o, ...res.data } : o))
        );
        // Refresh products catalog in case stock changed
        const prodRes = await api.get('/products');
        if (prodRes.data && Array.isArray(prodRes.data)) setProducts(prodRes.data);
      }
    } catch (err) {
      console.error('Order status update failed:', err);
    }
  };

  // Review CRUD
  const addReview = async (productId, reviewData) => {
    try {
      const res = await api.post(`/products/${productId}/reviews`, reviewData);
      if (res.data) {
        setReviews((prev) => [res.data, ...prev]);
        // Refresh products catalog to show updated ratings
        const prodRes = await api.get('/products');
        if (prodRes.data && Array.isArray(prodRes.data)) setProducts(prodRes.data);
        return res.data;
      }
    } catch (err) {
      throw err;
    }
  };

  const deleteReview = async (productId, reviewId) => {
    try {
      await api.delete(`/reviews/${reviewId}`);
      setReviews((prev) => prev.filter((r) => r._id !== reviewId && r.id !== reviewId));
      const prodRes = await api.get('/products');
      if (prodRes.data && Array.isArray(prodRes.data)) setProducts(prodRes.data);
    } catch (err) {
      console.error('Review delete failed:', err);
    }
  };

  const getProductReviews = (productId) => {
    return reviews.filter(
      (r) => r.productIdStr === productId || r.product === productId || r.productId === productId
    );
  };

  const getAllReviewsFlat = () => {
    return reviews;
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        siteBanners,
        updateSiteBanners,
        coupons,
        addCoupon,
        toggleCouponStatus,
        deleteCoupon,
        orders,
        updateOrderStatus,
        reviews,
        addReview,
        deleteReview,
        getProductReviews,
        getAllReviewsFlat,
        fetchBackendData,
        loading,
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

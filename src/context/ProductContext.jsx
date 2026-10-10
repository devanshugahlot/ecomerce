import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { MOCK_PRODUCTS as INITIAL_PRODUCTS } from '../utils/mockProducts';

const ProductContext = createContext();

const SAMPLE_SITE_BANNERS = {
  heroBanner: '',
  promoBanner1: '',
};

const SAMPLE_CATEGORIES = [];

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('bold_products_clean');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('bold_categories_clean');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  const [siteBanners, setSiteBanners] = useState(() => {
    const saved = localStorage.getItem('bold_site_banners_clean');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return { heroBanner: '', promoBanner1: '' };
  });

  const [reviewsMap, setReviewsMap] = useState(() => {
    const saved = localStorage.getItem('bold_reviews_clean');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {};
  });

  const [coupons, setCoupons] = useState(() => {
    const saved = localStorage.getItem('bold_coupons_clean');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { _id: 'coup_1', id: 'coup_1', code: 'BOLD10', discountType: 'percentage', discountValue: 10, minOrderAmount: 0, isActive: true }
    ];
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('bold_orders_clean');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  // Fetch initial products, categories, and banners from Render backend REST API
  useEffect(() => {
    let isMounted = true;
    const fetchBackendData = async () => {
      try {
        const [prodRes, catRes, banRes] = await Promise.allSettled([
          api.get('/products'),
          api.get('/categories'),
          api.get('/banners'),
        ]);

        if (isMounted) {
          if (prodRes.status === 'fulfilled' && Array.isArray(prodRes.value.data)) {
            setProducts(prodRes.value.data);
          }
          if (catRes.status === 'fulfilled' && Array.isArray(catRes.value.data)) {
            setCategories(catRes.value.data);
          }
          if (banRes.status === 'fulfilled' && banRes.value.data && typeof banRes.value.data === 'object') {
            setSiteBanners((prev) => ({ ...prev, ...banRes.value.data }));
          }
        }
      } catch (err) {
        console.warn('Backend API initial load error:', err);
      }
    };

    fetchBackendData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('bold_products_clean', JSON.stringify(products));
    } catch (e) {
      console.warn('LocalStorage quota warning:', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('bold_categories_clean', JSON.stringify(categories));
    } catch (e) {
      console.warn('LocalStorage quota warning:', e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem('bold_site_banners_clean', JSON.stringify(siteBanners));
    } catch (e) {
      console.warn('LocalStorage quota warning:', e);
    }
  }, [siteBanners]);

  useEffect(() => {
    try {
      localStorage.setItem('bold_reviews_clean', JSON.stringify(reviewsMap));
    } catch (e) {
      console.warn('LocalStorage quota warning:', e);
    }
  }, [reviewsMap]);

  // Listen to native storage changes across separate browser windows
  useEffect(() => {
    const handleStorageUpdate = (e) => {
      try {
        if (e.key === 'bold_products_clean' && e.newValue) setProducts(JSON.parse(e.newValue));
        if (e.key === 'bold_categories_clean' && e.newValue) setCategories(JSON.parse(e.newValue));
        if (e.key === 'bold_site_banners_clean' && e.newValue) setSiteBanners(JSON.parse(e.newValue));
        if (e.key === 'bold_reviews_clean' && e.newValue) setReviewsMap(JSON.parse(e.newValue));
      } catch (err) {}
    };

    window.addEventListener('storage', handleStorageUpdate);
    return () => {
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, []);

  // Category CRUD
  const addCategory = async (newCat) => {
    const tempId = 'cat_' + Date.now();
    const catToAdd = {
      id: tempId,
      name: newCat.name.trim(),
      slug: newCat.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      badge: newCat.badge || 'NEW',
      image: newCat.image || '',
      ...newCat
    };

    setCategories((prev) => [...prev, catToAdd]);

    try {
      const res = await api.post('/categories', catToAdd);
      if (res.data && (res.data._id || res.data.id)) {
        const savedCat = res.data;
        setCategories((prev) =>
          prev.map((c) => (c.id === tempId || c._id === tempId ? { ...c, ...savedCat } : c))
        );
        return savedCat;
      }
    } catch (err) {
      console.error('Category backend sync failed:', err);
    }
    return catToAdd;
  };

  const updateCategory = async (id, updatedData) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id || c._id === id ? { ...c, ...updatedData } : c))
    );

    try {
      await api.put(`/categories/${id}`, updatedData);
    } catch (err) {
      console.error('Category update backend sync failed:', err);
    }
  };

  const deleteCategory = async (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id && c._id !== id));

    try {
      await api.delete(`/categories/${id}`);
    } catch (err) {
      console.error('Category delete backend sync failed:', err);
    }
  };

  // Banner Updates
  const updateSiteBanners = async (newBanners) => {
    setSiteBanners((prev) => ({ ...prev, ...newBanners }));

    try {
      await api.put('/banners', newBanners);
    } catch (err) {
      console.error('Banners update backend sync failed:', err);
    }
  };

  // Review CRUD
  const addReview = (productId, reviewData) => {
    const newRev = {
      id: Date.now(),
      productId: productId,
      name: reviewData.name || 'Verified Customer',
      rating: Number(reviewData.rating || 5),
      date: 'Just now',
      verified: true,
      title: reviewData.title || 'Product Review',
      comment: reviewData.comment || '',
      image: reviewData.image || null,
      helpful: 0
    };

    setReviewsMap((prev) => {
      const list = prev[productId] || [];
      return {
        ...prev,
        [productId]: [newRev, ...list]
      };
    });

    setProducts((prev) =>
      prev.map((p) => {
        if (p._id === productId || p.id === productId) {
          const currentCount = p.reviewCount || 0;
          return {
            ...p,
            reviewCount: currentCount + 1
          };
        }
        return p;
      })
    );

    return newRev;
  };

  const deleteReview = (productId, reviewId) => {
    setReviewsMap((prev) => {
      const list = prev[productId] || [];
      return {
        ...prev,
        [productId]: list.filter((r) => r.id !== reviewId && r._id !== reviewId)
      };
    });
  };

  const getProductReviews = (productId) => {
    return reviewsMap[productId] || [];
  };

  const getAllReviewsFlat = () => {
    const all = [];
    Object.keys(reviewsMap).forEach((pId) => {
      reviewsMap[pId].forEach((r) => {
        all.push({ ...r, productId: pId });
      });
    });
    return all;
  };

  // Product CRUD
  const addProduct = async (newProd) => {
    const tempId = 'prod_' + Date.now();
    const productToAdd = {
      _id: tempId,
      id: tempId,
      rating: 5.0,
      reviewCount: 0,
      isBestSeller: true,
      isFeatured: true,
      isRx: false,
      images: newProd.images || [newProd.image || ''],
      packs: newProd.packs || [
        { name: newProd.packName || 'Pack of 1', price: Number(newProd.price), comparePrice: Number(newProd.comparePrice || newProd.price * 1.5), savings: '20% OFF' }
      ],
      benefits: newProd.benefits || ['High Quality Formula'],
      ingredients: newProd.ingredients || 'Ingredients details as specified.',
      usage: newProd.usage || 'Use as directed.',
      ...newProd,
      price: Number(newProd.price),
      comparePrice: Number(newProd.comparePrice || newProd.price * 1.5),
      stock: Number(newProd.stock || 50),
    };

    setProducts((prev) => [productToAdd, ...prev]);

    try {
      const res = await api.post('/products', productToAdd);
      if (res.data && (res.data._id || res.data.id)) {
        const savedProd = res.data;
        setProducts((prev) =>
          prev.map((p) => (p._id === tempId || p.id === tempId ? { ...p, ...savedProd } : p))
        );
        return savedProd;
      }
    } catch (err) {
      console.error('Product backend sync failed:', err);
    }
    return productToAdd;
  };

  const updateProduct = async (id, updatedData) => {
    setProducts((prev) =>
      prev.map((p) => (p._id === id || p.id === id ? { ...p, ...updatedData } : p))
    );

    try {
      await api.put(`/products/${id}`, updatedData);
    } catch (err) {
      console.error('Product update backend sync failed:', err);
    }
  };

  const deleteProduct = async (id) => {
    setProducts((prev) => prev.filter((p) => p._id !== id && p.id !== id));

    try {
      await api.delete(`/products/${id}`);
    } catch (err) {
      console.error('Product delete backend sync failed:', err);
    }
  };

  const clearAllData = () => {
    setProducts([]);
    setCategories([]);
    setSiteBanners({ heroBanner: '', promoBanner1: '' });
    setReviewsMap({});
    localStorage.removeItem('bold_products_clean');
    localStorage.removeItem('bold_categories_clean');
    localStorage.removeItem('bold_site_banners_clean');
    localStorage.removeItem('bold_reviews_clean');
  };

  const seedSampleData = () => {
    setProducts(INITIAL_PRODUCTS);
    setCategories(SAMPLE_CATEGORIES);
    setSiteBanners(SAMPLE_SITE_BANNERS);
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
      orderNumber: 'BOLD-' + Date.now().toString().slice(-6),
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
        clearAllData,
        seedSampleData,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        siteBanners,
        updateSiteBanners,
        addReview,
        deleteReview,
        getProductReviews,
        getAllReviewsFlat,
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

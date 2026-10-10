import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_PRODUCTS as INITIAL_PRODUCTS } from '../utils/mockProducts';

const ProductContext = createContext();

const SAMPLE_SITE_BANNERS = {
  heroBanner: '/images/hero_banner.png',
  promoBanner1: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=1400',
  promoBanner2: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1400',
};

const SAMPLE_CATEGORIES = [
  { id: 'cat_sex', name: 'Sex', slug: 'Sex', badge: 'POPULAR', image: '/images/hypril_delay_gel.jpg' },
  { id: 'cat_hair', name: 'Hair', slug: 'Hair', badge: 'NEW', image: '/images/cat_extend.png' },
  { id: 'cat_performance', name: 'Performance', slug: 'Performance', badge: '80% FULVIC', image: '/images/cat_shilajit.png' },
  { id: 'cat_daily', name: 'Daily Care', slug: 'Daily', badge: 'DAILY', image: '/images/cat_supplements.png' },
  { id: 'cat_combos', name: 'Combos', slug: 'Combos', badge: 'SAVE 40%', image: '/images/cat_bestsellers.png' }
];

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

  // Sync to LocalStorage & Dispatch custom storage event for instant cross-tab & page update
  useEffect(() => {
    localStorage.setItem('bold_products_clean', JSON.stringify(products));
    window.dispatchEvent(new Event('bold_data_updated'));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('bold_categories_clean', JSON.stringify(categories));
    window.dispatchEvent(new Event('bold_data_updated'));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('bold_site_banners_clean', JSON.stringify(siteBanners));
    window.dispatchEvent(new Event('bold_data_updated'));
  }, [siteBanners]);

  useEffect(() => {
    localStorage.setItem('bold_reviews_clean', JSON.stringify(reviewsMap));
    window.dispatchEvent(new Event('bold_data_updated'));
  }, [reviewsMap]);

  // Listen to storage changes across windows
  useEffect(() => {
    const handleStorageUpdate = () => {
      try {
        const p = localStorage.getItem('bold_products_clean');
        if (p) setProducts(JSON.parse(p));
        const c = localStorage.getItem('bold_categories_clean');
        if (c) setCategories(JSON.parse(c));
        const b = localStorage.getItem('bold_site_banners_clean');
        if (b) setSiteBanners(JSON.parse(b));
        const r = localStorage.getItem('bold_reviews_clean');
        if (r) setReviewsMap(JSON.parse(r));
      } catch (e) {}
    };

    window.addEventListener('storage', handleStorageUpdate);
    window.addEventListener('bold_data_updated', handleStorageUpdate);
    return () => {
      window.removeEventListener('storage', handleStorageUpdate);
      window.removeEventListener('bold_data_updated', handleStorageUpdate);
    };
  }, []);

  // Category CRUD
  const addCategory = (newCat) => {
    const id = 'cat_' + Date.now();
    const catToAdd = {
      id: id,
      name: newCat.name.trim(),
      slug: newCat.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      badge: newCat.badge || 'NEW',
      image: newCat.image || '',
      ...newCat
    };
    setCategories((prev) => [...prev, catToAdd]);
    return catToAdd;
  };

  const updateCategory = (id, updatedData) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id || c._id === id ? { ...c, ...updatedData } : c))
    );
  };

  const deleteCategory = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id && c._id !== id));
  };

  // Banner Updates
  const updateSiteBanners = (newBanners) => {
    setSiteBanners((prev) => ({ ...prev, ...newBanners }));
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
  const addProduct = (newProd) => {
    const id = 'prod_' + Date.now();
    const productToAdd = {
      _id: id,
      id: id,
      rating: 5.0,
      reviewCount: 0,
      isBestSeller: true,
      isFeatured: true,
      isRx: false,
      images: [newProd.image || ''],
      packs: [
        { name: newProd.packName || 'Pack of 1', price: Number(newProd.price), comparePrice: Number(newProd.comparePrice || newProd.price * 1.5), savings: '20% OFF' }
      ],
      benefits: ['High Quality Formula'],
      ingredients: newProd.ingredients || 'Ingredients details as specified.',
      usage: newProd.usage || 'Use as directed.',
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

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    const saved = localStorage.getItem('vyro_wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const { addToast } = useToast();

  useEffect(() => {
    localStorage.setItem('vyro_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const toggleWishlist = (product) => {
    const id = product._id || product.id;
    const exists = wishlistItems.some((item) => (item._id || item.id) === id);

    if (exists) {
      setWishlistItems((prev) => prev.filter((item) => (item._id || item.id) !== id));
      addToast(`Removed ${product.name} from wishlist`, 'info');
    } else {
      setWishlistItems((prev) => [...prev, product]);
      addToast(`Saved ${product.name} to wishlist`, 'success');
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => (item._id || item.id) === productId);
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((prev) => prev.filter((item) => (item._id || item.id) !== productId));
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};

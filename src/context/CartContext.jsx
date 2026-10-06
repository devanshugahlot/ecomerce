import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('vyro_cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    localStorage.setItem('vyro_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1, selectedVariant = null) => {
    setCartItems((prevItems) => {
      const itemKey = `${product._id || product.id}-${selectedVariant?.id || 'default'}`;
      const existingIndex = prevItems.findIndex((item) => item.key === itemKey);

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevItems,
          {
            key: itemKey,
            productId: product._id || product.id,
            name: product.name,
            price: selectedVariant?.price || product.price,
            comparePrice: product.comparePrice,
            image: product.images ? product.images[0] : product.image,
            variant: selectedVariant,
            quantity: quantity,
            stock: product.stock || 50,
            category: product.category,
          },
        ];
      }
    });

    addToast(`Added ${product.name} to cart`, 'success');
    setIsCartOpen(true);
  };

  const updateQuantity = (itemKey, delta) => {
    setCartItems((prevItems) => {
      return prevItems
        .map((item) => {
          if (item.key === itemKey) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            if (newQty > item.stock) {
              addToast(`Only ${item.stock} items available in stock`, 'error');
              return item;
            }
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (itemKey) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.key !== itemKey));
    addToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code, discountType, discountValue, minOrder = 0, maxDiscount = Infinity) => {
    const subtotal = getSubtotal();
    if (subtotal < minOrder) {
      addToast(`Coupon requires minimum order of ₹${minOrder}`, 'error');
      return false;
    }

    let discountAmount = 0;
    if (discountType === 'percentage') {
      discountAmount = Math.min((subtotal * discountValue) / 100, maxDiscount);
    } else {
      discountAmount = Math.min(discountValue, subtotal);
    }

    setAppliedCoupon({
      code,
      discountType,
      discountValue,
      discountAmount,
    });

    addToast(`Coupon '${code}' applied successfully!`, 'success');
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast('Coupon removed', 'info');
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getShippingFee = () => {
    const subtotal = getSubtotal();
    if (subtotal === 0) return 0;
    return subtotal > 799 ? 0 : 79; // Free shipping over ₹799
  };

  const getDiscountAmount = () => {
    if (!appliedCoupon) return 0;
    const subtotal = getSubtotal();
    if (appliedCoupon.discountType === 'percentage') {
      return Math.round((subtotal * appliedCoupon.discountValue) / 100);
    }
    return Math.min(appliedCoupon.discountValue, subtotal);
  };

  const getTotal = () => {
    const subtotal = getSubtotal();
    const shipping = getShippingFee();
    const discount = getDiscountAmount();
    return Math.max(0, subtotal + shipping - discount);
  };

  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        getSubtotal,
        getShippingFee,
        getDiscountAmount,
        getTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

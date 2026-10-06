import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Tag, PackageCheck, ShieldCheck, Lock, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/currency';
import { MOCK_PRODUCTS } from '../../utils/mockProducts';

export const CartDrawer = () => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    addToCart,
    getSubtotal,
    getShippingFee,
    getDiscountAmount,
    getTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const subtotal = getSubtotal();
  const shipping = getShippingFee();
  const discount = getDiscountAmount();
  const total = getTotal();

  const FREE_SHIPPING_THRESHOLD = 999;
  const progressPercent = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    
    const code = couponCode.trim().toUpperCase();
    if (code === 'HYPRIL10' || code === 'BOLD10' || code === 'VYRO10') {
      applyCoupon(code, 'percentage', 10, 0);
    } else if (code === 'FREESHIP') {
      applyCoupon('FREESHIP', 'fixed', 99, 0);
    } else {
      applyCoupon(code, 'percentage', 10, 0);
    }
    setCouponCode('');
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  // Upsell suggestion product (not already in cart)
  const upsellProduct = MOCK_PRODUCTS.find((p) => !cartItems.some((item) => item.id === p.id)) || MOCK_PRODUCTS[0];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartOpen(false)}
          className="fixed inset-0 bg-[#1B1F1D]/70 backdrop-blur-sm"
        />

        {/* Drawer Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-md bg-[#FAF7F2] border-l border-[#E4E0D8] h-full flex flex-col z-10 shadow-2xl"
        >
          {/* Header */}
          <div className="p-5 border-b border-[#E4E0D8] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#0F3D2B]" />
              <h2 className="font-serif font-extrabold text-lg text-[#1B1F1D]">Your Cart</h2>
              <span className="text-xs bg-[#0F3D2B] text-white px-2.5 py-0.5 rounded-full font-extrabold">
                {cartItems.length}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-[#5B655F] hover:text-[#1B1F1D] p-1.5 rounded-xl hover:bg-[#EEF3EE] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-[#EEF3EE] p-3.5 border-b border-[#E4E0D8] space-y-1.5 text-xs">
            <div className="flex justify-between font-bold text-[#1B1F1D]">
              {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                <span className="text-[#0F3D2B] flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-[#B8924A]" /> You've unlocked FREE Express Shipping!
                </span>
              ) : (
                <span>
                  Add <strong className="text-[#0F3D2B]">₹{FREE_SHIPPING_THRESHOLD - subtotal}</strong> more for FREE shipping
                </span>
              )}
              <span className="text-[#5B655F] font-semibold">{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white border border-[#E4E0D8] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#0F3D2B] to-[#B8924A] transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-16 h-16 rounded-full bg-[#EEF3EE] flex items-center justify-center text-[#0F3D2B]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-extrabold text-[#1B1F1D] text-lg">Your cart is empty</h3>
                <p className="text-xs text-[#5B655F] font-medium max-w-xs leading-relaxed">
                  Explore our doctor-backed stamina gummies, Himalayan Shilajit gold, and discreet products.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/shop');
                  }}
                  className="btn-primary font-bold shadow-glow-forest"
                >
                  Shop Bestsellers
                </button>
              </div>
            ) : (
              <>
                {/* Cart Items List */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.key}
                      className="p-3.5 bg-white rounded-2xl border border-[#E4E0D8] flex gap-3.5 items-center shadow-sm"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover bg-[#FAF7F2] shrink-0"
                      />
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <h4 className="font-bold text-xs text-[#1B1F1D] line-clamp-1">{item.name}</h4>
                        {item.variant && (
                          <p className="text-[10px] text-[#5B655F] font-semibold">{item.variant.name}</p>
                        )}
                        <p className="text-xs font-black text-[#0F3D2B]">
                          {formatCurrency(item.price)}
                        </p>
                      </div>

                      {/* Controls */}
                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={() => removeFromCart(item.key)}
                          className="text-[#5B655F] hover:text-red-600 p-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="flex items-center border border-[#E4E0D8] rounded-lg bg-[#FAF7F2] overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.key, -1)}
                            className="p-1 text-[#5B655F] hover:text-[#1B1F1D]"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-black text-[#1B1F1D]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.key, 1)}
                            className="p-1 text-[#5B655F] hover:text-[#1B1F1D]"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Upsell "Complete the routine" Module */}
                {upsellProduct && (
                  <div className="p-3.5 bg-white rounded-2xl border border-[#B8924A]/30 shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-extrabold text-[#0F3D2B] uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#B8924A]" /> Complete The Routine
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img src={upsellProduct.images[0]} alt={upsellProduct.name} className="w-10 h-10 rounded-lg object-cover bg-[#FAF7F2] shrink-0" />
                        <div className="truncate">
                          <h5 className="font-bold text-xs text-[#1B1F1D] truncate">{upsellProduct.name}</h5>
                          <p className="text-[10px] font-black text-[#0F3D2B]">₹{upsellProduct.price}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => addToCart(upsellProduct)}
                        className="btn-gold py-1.5 px-3 text-[11px] font-bold shrink-0"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                )}

                {/* Coupon Code Section */}
                <div>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-3 bg-[#EEF3EE] border border-[#0F3D2B]/20 rounded-xl text-xs">
                      <div className="flex items-center gap-2 text-[#0F3D2B] font-bold">
                        <Tag className="w-4 h-4 text-[#B8924A]" />
                        <span>Code: {appliedCoupon.code}</span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-red-600 hover:underline font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Discount code (HYPRIL10)"
                        className="flex-1 bg-white border border-[#E4E0D8] rounded-xl px-3 py-2 text-xs text-[#1B1F1D] font-bold placeholder-slate-400 focus:outline-none focus:border-[#0F3D2B]"
                      />
                      <button type="submit" className="btn-secondary px-4 py-2 text-xs font-bold shrink-0">
                        Apply
                      </button>
                    </form>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer Calculations & Checkout */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-[#E4E0D8] bg-white space-y-3">
              <div className="space-y-1 text-xs text-[#5B655F] font-medium">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-black text-[#1B1F1D]">{formatCurrency(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#0F3D2B] font-bold">
                    <span>Discount</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Discreet Shipping</span>
                  <span>{shipping === 0 ? <strong className="text-[#0F3D2B] font-extrabold">FREE</strong> : formatCurrency(shipping)}</span>
                </div>
                <div className="flex justify-between text-base font-black text-[#1B1F1D] pt-2 border-t border-[#E4E0D8]">
                  <span>Total</span>
                  <span className="text-[#0F3D2B]">{formatCurrency(total)}</span>
                </div>
              </div>

              <button onClick={handleCheckout} className="btn-primary w-full py-3.5 text-sm font-bold shadow-glow-forest">
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Discreet Trust Signal */}
              <div className="space-y-1.5 text-[11px] text-center text-[#5B655F] pt-1">
                <p className="font-bold flex items-center justify-center gap-1.5 text-[#0F3D2B]">
                  <PackageCheck className="w-3.5 h-3.5 text-[#B8924A]" />
                  Ships in plain, unmarked packaging. 100% Confidential.
                </p>
                <div className="flex justify-center items-center gap-3 text-[10px] text-slate-400">
                  <span>COD Available</span>
                  <span>•</span>
                  <span>UPI Instant</span>
                  <span>•</span>
                  <span>256-Bit SSL Encrypted</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

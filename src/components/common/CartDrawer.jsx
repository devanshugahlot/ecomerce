import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Tag, PackageCheck, ShieldCheck, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductContext';
import { formatCurrency } from '../../utils/currency';

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

  const { products } = useProducts();
  const [couponCode, setCouponCode] = useState('');
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const subtotal = getSubtotal();
  const shipping = getShippingFee();
  const discount = getDiscountAmount();
  const total = getTotal();

  const FREE_SHIPPING_THRESHOLD = 500;
  const progressPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    
    const code = couponCode.trim().toUpperCase();
    if (code === 'BOLD10' || code === 'HYPRIL10' || code === 'VYRO10') {
      applyCoupon(code, 'percentage', 10, 0);
    } else {
      applyCoupon(code, 'percentage', 10, 0);
    }
    setCouponCode('');
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  // Upsell suggestion product
  const productList = products && products.length > 0 ? products : [];
  const upsellProduct = productList.find((p) => !cartItems.some((item) => (item._id || item.id) === (p._id || p.id))) || productList[0];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
        />

        {/* Drawer Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-md bg-white border-l border-slate-200 h-full flex flex-col z-10 shadow-2xl"
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#0D472E]" />
              <h2 className="font-heading font-black text-lg text-slate-900">Your Cart</h2>
              <span className="text-xs bg-[#0D472E] text-white px-2.5 py-0.5 rounded-full font-black">
                {cartItems.length}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-slate-500 hover:text-slate-900 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* FREE SHIPPING PROGRESS BAR (Matching Screenshot 2) */}
          <div className="bg-[#F0FDF4] p-4 border-b border-emerald-100 space-y-2 text-xs">
            <div className="flex justify-between font-black text-slate-900">
              {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                <span className="text-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> You've unlocked FREE Shipping!
                </span>
              ) : (
                <span>
                  Add <strong className="text-[#0D472E]">₹{FREE_SHIPPING_THRESHOLD - subtotal}</strong> more for FREE shipping
                </span>
              )}
              <span className="text-slate-700 font-extrabold">{progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#0D472E] to-[#E5B869] transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-16 h-16 rounded-full bg-[#F0FDF4] flex items-center justify-center text-[#0D472E]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-black text-slate-900 text-lg">Your cart is empty</h3>
                <p className="text-xs text-slate-500 font-medium max-w-xs leading-relaxed">
                  Add items to your cart to enjoy free discreet express shipping.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/shop');
                  }}
                  className="bg-[#0D472E] hover:bg-[#08301E] text-white font-black text-xs py-3.5 px-7 rounded-full shadow-md"
                >
                  Explore Products
                </button>
              </div>
            ) : (
              <>
                {/* Cart Items List */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.key}
                      className="p-3.5 bg-white rounded-2xl border border-slate-200 flex gap-3.5 items-center shadow-2xs"
                    >
                      <img
                        src={item.image || '/images/hypril_delay_gel.jpg'}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover bg-slate-50 shrink-0 border border-slate-100"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200';
                        }}
                      />
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <h4 className="font-heading font-black text-xs text-slate-900 line-clamp-1">{item.name}</h4>
                        {item.variant && (
                          <p className="text-[10px] text-slate-500 font-bold">{item.variant.name}</p>
                        )}
                        <p className="text-xs font-black text-[#0D472E]">
                          {formatCurrency(item.price)}
                        </p>
                      </div>

                      {/* Controls */}
                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={() => removeFromCart(item.key)}
                          className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.key, -1)}
                            className="p-1 text-slate-600 hover:text-slate-900"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-black text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.key, 1)}
                            className="p-1 text-slate-600 hover:text-slate-900"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* "COMPLETE THE ROUTINE" MODULE (Matching Screenshot 3) */}
                {upsellProduct && (
                  <div className="p-4 bg-[#FAF4E8]/60 rounded-2xl border border-[#E6D7C3] space-y-3 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-xs font-black text-[#0D472E] uppercase tracking-wider">
                      <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span>COMPLETE THE ROUTINE</span>
                    </div>

                    <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#E6D7C3]/60">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={(upsellProduct.images && upsellProduct.images[0]) || upsellProduct.image || '/images/hypril_delay_gel.jpg'}
                          alt={upsellProduct.name}
                          className="w-12 h-12 rounded-lg object-cover bg-slate-50 shrink-0 border border-slate-200"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200';
                          }}
                        />
                        <div className="min-w-0">
                          <h5 className="font-heading font-black text-xs text-slate-900 truncate">{upsellProduct.name}</h5>
                          <p className="text-xs font-black text-[#0D472E]">₹{upsellProduct.price}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => addToCart(upsellProduct)}
                        className="bg-[#0D472E] hover:bg-[#08301E] text-white text-xs font-black px-4 py-2 rounded-full shadow-xs shrink-0 flex items-center gap-1"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                )}

                {/* Coupon Input */}
                <div>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                      <div className="flex items-center gap-2 text-[#0D472E] font-bold">
                        <Tag className="w-4 h-4 text-[#E5B869]" />
                        <span>Code: {appliedCoupon.code}</span>
                      </div>
                      <button onClick={removeCoupon} className="text-rose-600 hover:underline font-bold">
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Discount code (BOLD10)"
                        className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-[#0D472E]"
                      />
                      <button type="submit" className="bg-[#0D472E] text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-[#08301E]">
                        Apply
                      </button>
                    </form>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer Totals */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-white space-y-3">
              <div className="space-y-1 text-xs text-slate-600 font-medium">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-black text-slate-900">{formatCurrency(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#0D472E] font-bold">
                    <span>Discount</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Discreet Shipping</span>
                  <span>{shipping === 0 ? <strong className="text-emerald-700 font-black">FREE</strong> : formatCurrency(shipping)}</span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-100">
                  <span>Total</span>
                  <span className="text-[#0D472E]">{formatCurrency(total)}</span>
                </div>
              </div>

              <button onClick={handleCheckout} className="bg-[#0D472E] hover:bg-[#08301E] text-white w-full py-4 text-sm font-heading font-black rounded-full shadow-md flex items-center justify-center gap-2">
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-[11px] text-center text-slate-500 pt-1">
                <p className="font-bold flex items-center justify-center gap-1.5 text-[#0D472E]">
                  <PackageCheck className="w-3.5 h-3.5 text-[#E5B869]" />
                  Ships in plain, unmarked packaging. 100% Confidential.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

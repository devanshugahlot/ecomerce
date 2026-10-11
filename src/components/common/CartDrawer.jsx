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
    if (code === 'HYPRIL10' || code === 'HYPRIL20' || code === 'BOLD10') {
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
          <div className="p-5 border-b border-[#E5E5E5] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-black" />
              <h2 className="font-heading font-black text-lg text-black">Your Cart</h2>
              <span className="text-xs bg-brand-green text-white px-2.5 py-0.5 rounded-full font-black">
                {cartItems.length}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-neutral-500 hover:text-black p-2 rounded-xl hover:bg-[#F5F5F5] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* FREE SHIPPING PROGRESS BAR */}
          <div className="bg-[#F5F5F5] p-4 border-b border-[#E5E5E5] space-y-2 text-xs">
            <div className="flex justify-between font-bold text-neutral-900">
              {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                <span className="text-black flex items-center gap-1 font-bold">
                  <ShieldCheck className="w-4 h-4 text-black" /> You've unlocked FREE Shipping!
                </span>
              ) : (
                <span>
                  Add <strong className="text-black font-black">₹{FREE_SHIPPING_THRESHOLD - subtotal}</strong> more for FREE shipping
                </span>
              )}
              <span className="text-neutral-700 font-extrabold">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#E5E5E5] overflow-hidden">
              <div
                className="h-full bg-brand-green transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-16 h-16 rounded-full bg-[#F5F5F5] flex items-center justify-center text-black">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-black text-black text-lg">Your cart is empty</h3>
                <p className="text-xs text-neutral-500 font-medium max-w-xs leading-relaxed">
                  Add items to your cart to enjoy free discreet express shipping.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/shop');
                  }}
                  className="bg-brand-green hover:bg-brand-greenDark text-white font-bold text-xs py-3.5 px-7 rounded-full shadow-sm min-h-[48px]"
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
                      className="p-3.5 bg-white rounded-2xl border border-[#E5E5E5] flex gap-3.5 items-center shadow-xs"
                    >
                      <img
                        src={item.image || '/images/hypril_delay_gel.jpg'}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover bg-[#F5F5F5] shrink-0 border border-[#E5E5E5]"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200';
                        }}
                      />
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <h4 className="font-heading font-bold text-xs text-black line-clamp-1">{item.name}</h4>
                        {item.variant && (
                          <p className="text-[10px] text-neutral-500 font-medium">{item.variant.name}</p>
                        )}
                        <p className="text-xs font-bold text-black">
                          {formatCurrency(item.price)}
                        </p>
                      </div>

                      {/* Controls */}
                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={() => removeFromCart(item.key)}
                          className="text-neutral-400 hover:text-black p-1 transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="flex items-center border border-[#E5E5E5] rounded-lg bg-[#F5F5F5] overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.key, -1)}
                            className="p-1.5 text-neutral-600 hover:text-black"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-black">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.key, 1)}
                            className="p-1.5 text-neutral-600 hover:text-black"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* "COMPLETE THE ROUTINE" MODULE */}
                {upsellProduct && (
                  <div className="p-4 bg-[#F5F5F5] rounded-2xl border border-[#E5E5E5] space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-black uppercase tracking-wider">
                      <Sparkles className="w-4 h-4 text-black" />
                      <span>Complete the Routine</span>
                    </div>

                    <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#E5E5E5]">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={(upsellProduct.images && upsellProduct.images[0]) || upsellProduct.image || '/images/hypril_delay_gel.jpg'}
                          alt={upsellProduct.name}
                          className="w-12 h-12 rounded-lg object-cover bg-[#F5F5F5] shrink-0 border border-[#E5E5E5]"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200';
                          }}
                        />
                        <div className="min-w-0">
                          <h5 className="font-heading font-bold text-xs text-black truncate">{upsellProduct.name}</h5>
                          <p className="text-xs font-bold text-black">₹{upsellProduct.price}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => addToCart(upsellProduct)}
                        className="bg-brand-green hover:bg-brand-greenDark text-white text-xs font-bold px-4 py-2 rounded-full shadow-xs shrink-0 flex items-center gap-1 min-h-[36px]"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                )}

                {/* Coupon Input */}
                <div>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-3 bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl text-xs">
                      <div className="flex items-center gap-2 text-black font-bold">
                        <Tag className="w-4 h-4 text-black" />
                        <span>Code: {appliedCoupon.code}</span>
                      </div>
                      <button onClick={removeCoupon} className="text-neutral-600 hover:text-black hover:underline font-bold">
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
                        className="flex-1 bg-white border border-[#E5E5E5] rounded-xl px-3.5 py-2.5 text-xs text-black font-bold focus:outline-none focus:border-black min-h-[44px]"
                      />
                      <button type="submit" className="bg-brand-green text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-brand-greenDark min-h-[44px]">
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
            <div className="p-5 border-t border-[#E5E5E5] bg-white space-y-3">
              <div className="space-y-1.5 text-xs text-neutral-600 font-medium">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-black">{formatCurrency(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-black font-bold">
                    <span>Discount</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Discreet Shipping</span>
                  <span>{shipping === 0 ? <strong className="text-black font-bold">FREE</strong> : formatCurrency(shipping)}</span>
                </div>
                <div className="flex justify-between text-base font-black text-black pt-2 border-t border-[#E5E5E5]">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              <button onClick={handleCheckout} className="bg-brand-green hover:bg-brand-greenDark text-white w-full py-3.5 text-sm font-heading font-bold rounded-full shadow-sm flex items-center justify-center gap-2 min-h-[48px]">
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-[11px] text-center text-neutral-500 pt-1">
                <p className="font-medium flex items-center justify-center gap-1.5 text-neutral-700">
                  <PackageCheck className="w-3.5 h-3.5 text-black" />
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

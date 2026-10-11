import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus, Tag, ShieldCheck, Truck } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/currency';
import { BRAND_NAME } from '../utils/constants';

export const Cart = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    getSubtotal,
    getShippingFee,
    getDiscountAmount,
    getTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const navigate = useNavigate();

  const subtotal = getSubtotal();
  const shipping = getShippingFee();
  const discount = getDiscountAmount();
  const total = getTotal();

  const handleApply = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    applyCoupon(couponInput.trim().toUpperCase(), 'percentage', 10, 0);
    setCouponInput('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-white text-black min-h-[80vh]">
      <SEO title={`Shopping Cart — ${BRAND_NAME}`} description="Review items in your shopping cart." noIndex={true} />

      <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
        <h1 className="text-2xl sm:text-3xl font-heading font-black text-black flex items-center gap-3">
          <ShoppingBag className="w-7 h-7 text-black" />
          Shopping Cart ({cartItems.length})
        </h1>
        <Link to="/shop" className="text-xs font-semibold text-neutral-600 hover:text-black hover:underline">
          Continue Shopping
        </Link>
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center space-y-4 border border-neutral-200 shadow-2xs max-w-md mx-auto my-12">
          <div className="w-16 h-16 rounded-full bg-neutral-100 text-black mx-auto flex items-center justify-center">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-heading font-bold text-black">Your cart is empty</h2>
          <p className="text-xs text-neutral-500 font-medium">Explore premium formulations crafted for modern men.</p>
          <Link to="/shop" className="btn-primary text-xs py-3.5 px-6 inline-flex font-bold rounded-full min-h-[48px] items-center justify-center">
            Shop Bestsellers
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items List - 8 Cols */}
          <div className="lg:col-span-8 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.key}
                className="p-4 sm:p-6 bg-white rounded-2xl border border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover bg-neutral-100 shrink-0 border border-neutral-200"
                  />
                  <div>
                    <h3 className="font-heading font-bold text-base text-black">{item.name}</h3>
                    <p className="text-xs text-neutral-500 font-medium mt-0.5">{item.category}</p>
                    <span className="text-sm font-black text-black mt-2 block">
                      {formatCurrency(item.price)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                  <div className="flex items-center border border-neutral-200 rounded-xl bg-neutral-50 h-[44px]">
                    <button
                      onClick={() => updateQuantity(item.key, -1)}
                      className="p-2.5 text-neutral-600 hover:text-black min-w-[36px] flex items-center justify-center"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-3 text-xs font-black text-black">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.key, 1)}
                      className="p-2.5 text-neutral-600 hover:text-black min-w-[36px] flex items-center justify-center"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <span className="font-black text-base text-black">
                    {formatCurrency(item.price * item.quantity)}
                  </span>

                  <button
                    onClick={() => removeFromCart(item.key)}
                    className="text-neutral-400 hover:text-black p-2 min-w-[36px] min-h-[36px] flex items-center justify-center"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary - 4 Cols */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-neutral-200 space-y-6 shadow-2xs">
            <h2 className="font-heading font-bold text-lg text-black pb-3 border-b border-neutral-100">
              Order Summary
            </h2>

            {/* Coupon Code */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                Promo Code
              </label>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-neutral-100 border border-neutral-300 rounded-xl text-xs">
                  <span className="text-black font-bold flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-black" /> Code: {appliedCoupon.code}
                  </span>
                  <button onClick={removeCoupon} className="text-neutral-600 font-bold hover:text-black hover:underline">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApply} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="e.g. HYPRIL10"
                    className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-xs text-black font-bold placeholder-neutral-400 focus:outline-none focus:border-black min-h-[44px]"
                  />
                  <button type="submit" className="btn-secondary text-xs px-4 py-2.5 font-bold min-h-[44px]">
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2.5 text-xs text-neutral-600 font-medium pt-2 border-t border-neutral-100">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-black">{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-black font-bold">
                  <span>Coupon Discount</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span>{shipping === 0 ? <strong className="text-black font-bold">FREE</strong> : formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-black pt-3 border-t border-neutral-200">
                <span>Total Amount</span>
                <span className="text-black">{formatCurrency(total)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn-primary w-full py-4 text-xs font-bold rounded-full min-h-[48px] flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-[11px] text-neutral-500 font-medium space-y-1 text-center">
              <p className="flex items-center justify-center gap-1.5 text-neutral-700">
                <ShieldCheck className="w-3.5 h-3.5 text-black" /> Discreet Packaging & Free Delivery
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

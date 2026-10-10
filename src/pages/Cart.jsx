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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-slate-50 text-slate-900">
      <SEO title={`Shopping Cart — ${BRAND_NAME}`} description="Review items in your shopping cart." noIndex={true} />

      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <h1 className="text-3xl font-heading font-extrabold text-slate-900 flex items-center gap-3">
          <ShoppingBag className="w-8 h-8 text-[#0A7E8C]" />
          Shopping Cart ({cartItems.length})
        </h1>
        <Link to="/shop" className="text-xs font-bold text-[#0A7E8C] hover:underline">
          Continue Shopping
        </Link>
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-slate-200 shadow-sm max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-teal-50 text-[#0A7E8C] mx-auto flex items-center justify-center">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-heading font-bold text-slate-900">Your cart is empty</h2>
          <p className="text-xs text-slate-600 font-medium">Explore doctor-formulated performance wellness solutions.</p>
          <Link to="/shop" className="btn-primary text-xs py-3 px-6 inline-flex font-extrabold">
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
                className="p-4 sm:p-6 bg-white rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover bg-slate-50 shrink-0 border border-slate-100"
                  />
                  <div>
                    <h3 className="font-heading font-extrabold text-base text-slate-900">{item.name}</h3>
                    <p className="text-xs text-[#0A7E8C] font-bold mt-0.5">{item.category}</p>
                    <span className="text-sm font-black text-slate-900 mt-2 block">
                      {formatCurrency(item.price)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                    <button
                      onClick={() => updateQuantity(item.key, -1)}
                      className="p-2 text-slate-500 hover:text-slate-900"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-3 text-xs font-black text-slate-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.key, 1)}
                      className="p-2 text-slate-500 hover:text-slate-900"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <span className="font-black text-base text-slate-900">
                    {formatCurrency(item.price * item.quantity)}
                  </span>

                  <button
                    onClick={() => removeFromCart(item.key)}
                    className="text-slate-400 hover:text-rose-600 p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary - 4 Cols */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 space-y-6 shadow-sm">
            <h2 className="font-heading font-extrabold text-lg text-slate-900 pb-3 border-b border-slate-100">
              Order Summary
            </h2>

            {/* Coupon Code */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Promo Code
              </label>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-teal-50 border border-[#0A7E8C]/20 rounded-xl text-xs">
                  <span className="text-[#0A7E8C] font-bold flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-[#D4A373]" /> Code: {appliedCoupon.code}
                  </span>
                  <button onClick={removeCoupon} className="text-rose-600 font-bold hover:underline">
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
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:border-[#0A7E8C]"
                  />
                  <button type="submit" className="btn-secondary text-xs px-4 py-2 font-bold">
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs text-slate-700 font-medium pt-2 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-extrabold text-slate-900">{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#0A7E8C] font-bold">
                  <span>Coupon Discount</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span>{shipping === 0 ? <strong className="text-[#0A7E8C] font-extrabold">FREE</strong> : formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
                <span>Total Amount</span>
                <span className="text-[#0A7E8C]">{formatCurrency(total)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn-primary w-full py-3.5 text-sm font-extrabold shadow-glow-primary"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-[11px] text-slate-600 font-bold space-y-1 text-center">
              <p className="flex items-center justify-center gap-1 text-[#0A7E8C]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4A373]" /> 100% Confidential Plain Box Delivery
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


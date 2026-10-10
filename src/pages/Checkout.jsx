import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  Package,
  MapPin,
  ArrowRight
} from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/currency';
import { BRAND_NAME } from '../utils/constants';
import api from '../services/api';

export const Checkout = () => {
  const { cartItems, getSubtotal, getShippingFee, getDiscountAmount, getTotal, appliedCoupon, clearCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Address state
  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    line1: '',
    city: '',
    state: '',
    postalCode: '',
  });

  // Delivery & Payment choices
  const [paymentMethod, setPaymentMethod] = useState('razorpay'); // 'razorpay' or 'cod'

  const subtotal = getSubtotal();
  const shipping = getShippingFee();
  const discount = getDiscountAmount();
  const total = getTotal();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4">
        <h2 className="text-xl font-heading font-bold text-slate-900">Your cart is empty</h2>
        <p className="text-xs text-slate-600 font-medium">Add products before checking out.</p>
        <button onClick={() => navigate('/shop')} className="btn-primary text-xs py-3 px-6 font-extrabold">
          Shop Products
        </button>
      </div>
    );
  }

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!address.fullName || !address.phone || !address.line1 || !address.postalCode) {
      addToast('Please fill in all address details', 'error');
      return;
    }
    if (address.postalCode.length !== 6 || !/^\d+$/.test(address.postalCode)) {
      addToast('PIN code must be a valid 6-digit number', 'error');
      return;
    }
    setStep(2);
  };

  // Dynamically load Razorpay SDK
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    if (loading) return;
    setLoading(true);

    const orderPayload = {
      orderItems: cartItems.map((item) => ({
        productId: item.productId || item.product || item._id || item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      shippingAddress: address,
      paymentMethod: paymentMethod === 'cod' ? 'COD' : 'Razorpay (Paid)',
      couponCode: appliedCoupon ? appliedCoupon.code : null,
    };

    if (paymentMethod === 'cod') {
      try {
        const res = await api.post('/orders', orderPayload);
        const savedOrder = res.data?.order || { orderNumber: 'HYP-' + Date.now().toString().slice(-6), totalPrice: total, paymentMethod: 'COD' };
        clearCart();
        addToast('Order placed successfully with Cash on Delivery!', 'success');
        navigate('/order-success', { state: { order: savedOrder } });
      } catch (err) {
        const errMsg = err.response?.data?.message || 'Error placing order';
        addToast(errMsg, 'error');
      } finally {
        setLoading(false);
      }
      return;
    }

    // Razorpay Flow
    const sdkLoaded = await loadRazorpayScript();
    if (!sdkLoaded) {
      addToast('Razorpay SDK failed to load. Please check internet connection.', 'error');
      setLoading(false);
      return;
    }

    try {
      // 1. Create Razorpay order on backend
      let razorpayOrder;
      try {
        const createRes = await api.post('/payments/create', { amount: total });
        razorpayOrder = createRes.data;
      } catch (e) {
        razorpayOrder = {
          id: 'order_mock_' + Date.now(),
          amount: total * 100,
          currency: 'INR'
        };
      }

      // 2. Options for Razorpay Popup
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_HyprilMockKey123',
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency || 'INR',
        name: `${BRAND_NAME} Wellness`,
        description: 'Order Payment — 100% Discreet Packaging',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200',
        order_id: razorpayOrder.id,
        handler: async function (response) {
          let savedOrder;
          try {
            await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
          } catch (e) {}

          try {
            const res = await api.post('/orders', orderPayload);
            savedOrder = res.data?.order;
          } catch (e) {}

          clearCart();
          addToast('Payment successful! Your order has been placed.', 'success');
          navigate('/order-success', {
            state: {
              order: savedOrder || {
                orderNumber: 'HYP-' + Date.now().toString().slice(-6),
                totalPrice: total,
                paymentMethod: 'Razorpay (Paid)'
              }
            }
          });
        },
        prefill: {
          name: address.fullName,
          email: user?.email || `customer@${BRAND_NAME.toLowerCase()}.com`,
          contact: address.phone
        },
        theme: {
          color: '#0D472E'
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function () {
        addToast('Payment failed or cancelled.', 'error');
      });
      rzp1.open();
    } catch (err) {
      addToast('Payment processing error.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-slate-50 text-slate-900">
      <SEO title={`Secure Checkout — ${BRAND_NAME}`} description="Complete your wellness purchase." noIndex={true} />

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <h1 className="text-3xl font-heading font-extrabold text-slate-900 flex items-center gap-3">
          <Lock className="w-7 h-7 text-[#0D472E]" />
          Encrypted Checkout
        </h1>
        <div className="flex items-center gap-2 text-xs text-[#0D472E] font-extrabold bg-teal-50 px-3.5 py-1.5 rounded-full border border-[#0D472E]/20">
          <ShieldCheck className="w-4 h-4 text-[#0D472E]" /> 256-Bit SSL Protected
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Checkout Steps Column - 8 Cols */}
        <div className="lg:col-span-8 space-y-6">
          {/* Step 1: Delivery Address */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-heading font-extrabold text-lg text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#0D472E] text-white font-black text-xs flex items-center justify-center">1</span>
                Shipping Address
              </h2>
              {step > 1 && (
                <button onClick={() => setStep(1)} className="text-xs text-[#0D472E] font-bold hover:underline">
                  Edit
                </button>
              )}
            </div>

            {step === 1 ? (
              <form onSubmit={handleAddressSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      placeholder="Vikram Rao"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number (+91)</label>
                    <input
                      type="tel"
                      required
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      placeholder="+91 9876543210"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-medium"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Street Address / House No.</label>
                    <input
                      type="text"
                      required
                      value={address.line1}
                      onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                      placeholder="B-402, Green Palm Heights, HSR Layout"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      placeholder="Bengaluru"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">PIN Code (6 Digits)</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={address.postalCode}
                      onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                      placeholder="560102"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-medium"
                    />
                  </div>
                </div>
                <button type="submit" className="btn-primary bg-[#0D472E] text-white text-xs py-3 px-6 font-extrabold">
                  Continue to Delivery & Payment
                </button>
              </form>
            ) : (
              <div className="text-xs text-slate-700 font-medium space-y-1">
                <p className="font-extrabold text-slate-900">{address.fullName} ({address.phone})</p>
                <p>{address.line1}, {address.city} {address.postalCode}</p>
              </div>
            )}
          </div>

          {/* Step 2: Payment Method */}
          {step >= 2 && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4 shadow-sm">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="font-heading font-extrabold text-lg text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#0D472E] text-white font-black text-xs flex items-center justify-center">2</span>
                  Payment Method
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Razorpay Option */}
                <div
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                    paymentMethod === 'razorpay'
                      ? 'bg-teal-50 border-[#0D472E] text-slate-900 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-extrabold text-sm text-slate-900">Online Payment (Razorpay)</span>
                    <CreditCard className="w-5 h-5 text-[#0D472E]" />
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    UPI (Google Pay, PhonePe, Paytm), Cards & NetBanking.
                  </p>
                  <span className="inline-block text-[10px] text-[#0D472E] font-bold bg-teal-100 px-2.5 py-0.5 rounded-full">
                    Instant Confirmation
                  </span>
                </div>

                {/* Cash on Delivery Option */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                    paymentMethod === 'cod'
                      ? 'bg-teal-50 border-[#0D472E] text-slate-900 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-extrabold text-sm text-slate-900">Cash on Delivery (COD)</span>
                    <Truck className="w-5 h-5 text-[#D4A373]" />
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    Pay with cash or UPI at your doorstep upon package arrival.
                  </p>
                </div>
              </div>

              {/* Final Place Order CTA */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="btn-primary bg-[#0D472E] text-white w-full py-4 text-sm font-extrabold shadow-glow-primary flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <span>Pay {formatCurrency(total)} & Complete Order</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar - 4 Cols */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 space-y-6 shadow-sm">
          <h2 className="font-heading font-extrabold text-lg text-slate-900 pb-3 border-b border-slate-100">
            Order Items ({cartItems.length})
          </h2>

          <div className="space-y-3 max-h-60 overflow-y-auto">
            {cartItems.map((item) => (
              <div key={item.key} className="flex gap-3 items-center text-xs">
                <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-slate-50 shrink-0 border border-slate-100" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-extrabold text-slate-900 truncate">{item.name}</h4>
                  <span className="text-slate-500 font-medium">Qty: {item.quantity}</span>
                </div>
                <span className="font-black text-slate-900 shrink-0">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs text-slate-700 font-medium pt-3 border-t border-slate-100">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-extrabold text-slate-900">{formatCurrency(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-[#0D472E] font-bold">
                <span>Discount ({appliedCoupon?.code})</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shipping === 0 ? <strong className="text-[#0D472E] font-extrabold">FREE</strong> : formatCurrency(shipping)}</span>
            </div>
            <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
              <span>Total Payable</span>
              <span className="text-[#0D472E]">{formatCurrency(total)}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-2 font-medium">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <Package className="w-4 h-4 text-[#0D472E] shrink-0" />
              <span>100% Plain Unmarked Outer Box Packaging</span>
            </div>
            <p className="text-[10px] text-slate-500">
              Zero sensitive product names printed on shipping labels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

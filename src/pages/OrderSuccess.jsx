import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle2, PackageCheck, ArrowRight, ShieldCheck } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { formatCurrency } from '../utils/currency';

export const OrderSuccess = () => {
  const location = useLocation();
  const order = location.state?.order || {
    orderNumber: "VYRO-" + Date.now().toString().slice(-6),
    totalPrice: 1299,
    paymentMethod: "Razorpay (Paid)"
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-8 bg-[#FAF9F6] text-slate-900">
      <SEO title="Order Confirmed" description="Thank you for your VYRO purchase." noIndex={true} />

      <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-300 shadow-sm">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-widest">
          Payment Confirmed
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-slate-900">
          Thank You For Your Order!
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-medium">
          Your order ID is <strong className="text-slate-900 font-mono font-bold">{order.orderNumber}</strong>. We are preparing your order for express dispatch.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200 text-left space-y-4 shadow-sm">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <PackageCheck className="w-6 h-6 text-emerald-600 shrink-0" />
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">Discreet Dispatch Guarantee</h3>
            <p className="text-xs text-slate-600 font-medium">Packed in an unmarked box with zero brand indicators.</p>
          </div>
        </div>

        <div className="space-y-2 text-xs text-slate-700 font-medium">
          <div className="flex justify-between">
            <span>Total Amount Paid</span>
            <span className="font-black text-slate-900">{formatCurrency(order.totalPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span>Payment Method</span>
            <span className="font-bold text-emerald-700">{order.paymentMethod || 'Paid'}</span>
          </div>
          <div className="flex justify-between">
            <span>Estimated Delivery</span>
            <span className="font-extrabold text-slate-900">Within 2 to 3 Business Days</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
        <Link to="/account" className="btn-primary text-xs py-3.5 px-8 font-bold">
          <span>Track Order in Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link to="/shop" className="btn-secondary text-xs py-3.5 px-8 font-bold">
          <span>Return to Storefront</span>
        </Link>
      </div>
    </div>
  );
};

import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle2, PackageCheck, ArrowRight, ShieldCheck } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { formatCurrency } from '../utils/currency';

export const OrderSuccess = () => {
  const location = useLocation();
  const order = location.state?.order || {
    orderNumber: "HYP-" + Date.now().toString().slice(-6),
    totalPrice: 1299,
    paymentMethod: "Razorpay (Paid)"
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-8 min-h-screen">
      <SEO title="Order Confirmed" description="Thank you for your Hypril purchase." noIndex={true} />

      <div className="w-20 h-20 rounded-full bg-[#0D472E]/10 text-[#0D472E] mx-auto flex items-center justify-center border border-[#0D472E]/20 shadow-sm">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-3">
        <span className="text-xs font-bold text-[#0D472E] uppercase tracking-widest bg-[#0D472E]/10 px-3 py-1 rounded-full border border-[#0D472E]/20 inline-block">
          Payment Confirmed
        </span>
        <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900">
          Thank You For Your Order!
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-md mx-auto leading-relaxed">
          Your order ID is <strong className="text-slate-900 font-mono font-bold">{order.orderNumber}</strong>. We are preparing your order for express discreet dispatch.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 text-left space-y-5 shadow-sm">
        <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-[#0D472E]/10 text-[#0D472E] flex items-center justify-center shrink-0">
            <PackageCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-slate-900 text-sm">Discreet Packaging Guarantee</h3>
            <p className="text-xs text-slate-600 font-medium">Shipped in plain, unbranded safety packaging with complete privacy.</p>
          </div>
        </div>

        <div className="space-y-3 text-xs text-slate-700 font-medium">
          <div className="flex justify-between p-3 bg-slate-50/70 rounded-xl">
            <span>Total Amount Paid</span>
            <span className="font-heading font-bold text-slate-900">{formatCurrency(order.totalPrice)}</span>
          </div>
          <div className="flex justify-between p-3 bg-slate-50/70 rounded-xl">
            <span>Payment Method</span>
            <span className="font-bold text-[#0D472E]">{order.paymentMethod || 'Paid'}</span>
          </div>
          <div className="flex justify-between p-3 bg-slate-50/70 rounded-xl">
            <span>Estimated Delivery</span>
            <span className="font-bold text-slate-900">Within 2 to 3 Business Days</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
        <Link to="/account" className="btn-primary bg-[#0D472E] text-white text-xs py-3.5 px-8 font-bold shadow-md min-h-[44px] flex items-center justify-center gap-2">
          <span>Track Order in Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link to="/shop" className="btn-secondary text-xs py-3.5 px-8 font-bold min-h-[44px] flex items-center justify-center">
          <span>Return to Storefront</span>
        </Link>
      </div>
    </div>
  );
};

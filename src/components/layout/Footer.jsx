import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Package, CreditCard, Sparkles, Mail, Phone } from 'lucide-react';
import { BRAND_NAME, BRAND_TAGLINE } from '../../utils/constants';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-10 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Feature Highlights Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 mb-12 border-b border-slate-200">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-700">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900">100% Discreet Packaging</h4>
              <p className="text-xs text-slate-600 mt-0.5">Plain unmarked box. Complete privacy guaranteed.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="p-3 rounded-xl bg-amber-100 text-amber-700">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900">Doctor Formulated</h4>
              <p className="text-xs text-slate-600 mt-0.5">Clinical grade extracts with zero fluff.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-700">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900">Quality Inspected</h4>
              <p className="text-xs text-slate-600 mt-0.5">GMP Certified & FSSAI Compliant labs.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="p-3 rounded-xl bg-blue-100 text-blue-700">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900">256-Bit SSL Payment</h4>
              <p className="text-xs text-slate-600 mt-0.5">Razorpay encrypted checkout & COD.</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="font-extrabold text-2xl text-slate-900 tracking-tight">
                VYRO
              </span>
            </Link>
            <p className="text-xs text-slate-600 max-w-sm leading-relaxed font-medium">
              {BRAND_TAGLINE}. We empower modern men with transparent, effective, and discreet wellness solutions for stamina, daily vitality, and grooming.
            </p>
            <div className="space-y-1 text-slate-700 font-semibold">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-600" />
                <span>support@vyro.men</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>+91 1800-VYRO-CARE (Mon-Sat, 9am - 7pm)</span>
              </div>
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Shop Solutions</h4>
            <ul className="space-y-2 font-medium">
              <li><Link to="/shop?category=Sexual%20Wellness" className="hover:text-emerald-600 transition-colors">Sexual Wellness</Link></li>
              <li><Link to="/shop?category=Daily%20Performance" className="hover:text-emerald-600 transition-colors">Daily Performance</Link></li>
              <li><Link to="/shop?category=Grooming%20%26%20Beard" className="hover:text-emerald-600 transition-colors">Grooming & Beard</Link></li>
              <li><Link to="/shop?category=Intimate%20Care" className="hover:text-emerald-600 transition-colors">Intimate Care</Link></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Customer Care</h4>
            <ul className="space-y-2 font-medium">
              <li><Link to="/account" className="hover:text-emerald-600 transition-colors">Track Your Order</Link></li>
              <li><Link to="/cart" className="hover:text-emerald-600 transition-colors">View Cart</Link></li>
              <li><Link to="/wishlist" className="hover:text-emerald-600 transition-colors">My Saved Items</Link></li>
              <li><a href="#faq" className="hover:text-emerald-600 transition-colors">FAQs & Support</a></li>
            </ul>
          </div>

          {/* Legal / Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 font-medium">
              <li><span className="hover:text-emerald-600 cursor-pointer">About VYRO Science</span></li>
              <li><span className="hover:text-emerald-600 cursor-pointer">Ingredients Directory</span></li>
              <li><span className="hover:text-emerald-600 cursor-pointer">Privacy Policy</span></li>
              <li><Link to="/admin/login" className="text-amber-700 font-bold hover:underline">Admin Staff Portal</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} VYRO Wellness Inc. All rights reserved. Inspired by modern men's healthcare.</p>
          <div className="flex items-center gap-4 text-slate-700 font-semibold">
            <span>Razorpay Secured</span>
            <span>•</span>
            <span>UPI & NetBanking</span>
            <span>•</span>
            <span>Cash on Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

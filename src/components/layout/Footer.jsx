import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PackageCheck, ShieldCheck, Stethoscope, Lock, Mail, Phone } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { BRAND_NAME } from '../../utils/constants';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const { addToast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('Please enter a valid email address.', 'error');
      return;
    }
    addToast('Thank you for subscribing! Your 10% discount code is HYPRIL10.', 'success');
    setEmail('');
  };

  return (
    <footer className="bg-black text-white pt-16 pb-24 lg:pb-12 text-xs border-t border-neutral-900">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-8 space-y-12">
        
        {/* Top Feature Highlights Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-neutral-800">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
            <div className="p-3 rounded-xl bg-neutral-800 text-white shrink-0">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-heading font-bold text-sm text-white">100% Plain Box Packaging</h4>
              <p className="text-xs text-neutral-400 font-medium">Plain unmarked box with zero product names printed.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
            <div className="p-3 rounded-xl bg-neutral-800 text-white shrink-0">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-heading font-bold text-sm text-white">Doctor Formulated</h4>
              <p className="text-xs text-neutral-400 font-medium">Standardized extracts & batch verified dosages.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
            <div className="p-3 rounded-xl bg-neutral-800 text-white shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-heading font-bold text-sm text-white">Quality Certified</h4>
              <p className="text-xs text-neutral-400 font-medium">Manufactured in certified quality facilities.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
            <div className="p-3 rounded-xl bg-neutral-800 text-white shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-heading font-bold text-sm text-white">Secure Payments & COD</h4>
              <p className="text-xs text-neutral-400 font-medium">UPI, Cards & Cash on Delivery available.</p>
            </div>
          </div>
        </div>

        {/* Links Grid: Stacked on mobile, 5 cols on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Brand Info & Newsletter */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="font-heading font-black text-2xl tracking-tight text-white">
                HYPRIL
              </span>
              <span className="bg-white text-black text-[9px] font-black px-1.5 py-0.5 rounded tracking-widest uppercase">
                WELLNESS
              </span>
            </Link>
            
            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed font-medium">
              Premium men's wellness formulations. Delivering doctor-backed botanical extracts, Shilajit resin, and performance solutions discreetly to your doorstep.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2 pt-2 max-w-sm">
              <label className="text-[11px] font-bold uppercase text-neutral-400 tracking-wider block">
                Get 10% OFF Code (Use Code: HYPRIL10)
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 bg-black border border-white rounded-full px-4 py-2.5 text-xs text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-white min-h-[44px]"
                />
                <button type="submit" className="bg-white hover:bg-neutral-200 text-black py-2.5 px-6 text-xs font-bold rounded-full shrink-0 transition-colors min-h-[44px]">
                  Subscribe
                </button>
              </div>
            </form>
          </div>

          {/* Column 1: Shop */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Shop Categories</h4>
            <ul className="space-y-2 font-medium text-neutral-400">
              <li><Link to="/shop" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/shop?category=Performance" className="hover:text-white transition-colors">Performance & Shilajit</Link></li>
              <li><Link to="/shop?category=Daily" className="hover:text-white transition-colors">Daily Wellness</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">Catalog</Link></li>
            </ul>
          </div>

          {/* Column 2: Customer Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Customer Care</h4>
            <ul className="space-y-2 font-medium text-neutral-400">
              <li><a href="#contact" className="hover:text-white transition-colors">Contact Support</a></li>
              <li><Link to="/account" className="hover:text-white transition-colors">Track Your Order</Link></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Privacy & FAQs</a></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">Shopping Cart</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact & Address */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Contact Us</h4>
            <div className="space-y-2 text-neutral-400 font-medium">
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-white" /> support@hypril.com
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-white" /> +91 1800-HYPRIL-CARE
              </p>
              <p className="pt-1 text-[11px] text-neutral-500 leading-tight">
                Hypril Healthcare Pvt. Ltd.<br />
                Bengaluru, Karnataka, India.
              </p>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="pt-8 border-t border-neutral-800 text-[10px] text-neutral-500 leading-relaxed space-y-2">
          <p>
            <strong>Medical Disclaimer:</strong> Formulations and dietary supplements have been evaluated for safety. Products are intended for adult wellness enhancement. Consult a physician if you have specific medical concerns.
          </p>
          <p>
            100% Plain Box discreet delivery guaranteed on all shipments.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400 font-medium">
          <p>© {new Date().getFullYear()} Hypril. All rights reserved. Free & Discreet Delivery.</p>
          <div className="flex items-center gap-3 text-neutral-300 font-medium">
            <span>UPI / GPay / Paytm</span>
            <span>•</span>
            <span>Cards</span>
            <span>•</span>
            <span>Cash on Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

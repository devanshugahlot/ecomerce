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
    <footer className="bg-[#0D472E] text-white pt-16 pb-24 lg:pb-12 text-xs border-t border-[#08301E]">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-8 space-y-12">
        
        {/* Top Feature Highlights Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-white/15">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm">
            <div className="p-3 rounded-xl bg-[#E5B869]/20 text-[#E5B869]">
              <PackageCheck className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-heading font-extrabold text-sm text-white">100% Plain Box Packaging</h4>
              <p className="text-xs text-emerald-100/90 font-medium">Plain unmarked box with zero product names printed.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm">
            <div className="p-3 rounded-xl bg-[#E5B869]/20 text-[#E5B869]">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-heading font-extrabold text-sm text-white">Doctor Formulated</h4>
              <p className="text-xs text-emerald-100/90 font-medium">Clinical-grade extracts & batch verified dosages.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm">
            <div className="p-3 rounded-xl bg-[#E5B869]/20 text-[#E5B869]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-heading font-extrabold text-sm text-white">Quality Certified</h4>
              <p className="text-xs text-emerald-100/90 font-medium">FSSAI approved & AYUSH certified manufacturing.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm">
            <div className="p-3 rounded-xl bg-[#E5B869]/20 text-[#E5B869]">
              <Lock className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-heading font-extrabold text-sm text-white">Secure Payments & COD</h4>
              <p className="text-xs text-emerald-100/90 font-medium">UPI, Cards & Cash on Delivery across 19,000+ PINs.</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Brand Info & Newsletter */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="font-heading font-black text-3xl tracking-tighter text-white">
                HYPRIL
              </span>
              <span className="bg-[#E5B869] text-[#0D472E] text-[10px] font-black px-1.5 py-0.5 rounded tracking-widest uppercase">
                WELLNESS
              </span>
            </Link>
            
            <p className="text-xs text-emerald-100/90 max-w-sm leading-relaxed font-medium">
              India's No. 1 Men's Health & Intimacy Brand. Delivering doctor-approved delay gels, Shilajit resin, stamina capsules, and performance formulations discreetly to your doorstep.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2 pt-2 max-w-sm">
              <label className="text-[11px] font-black uppercase text-[#E5B869] tracking-wider block">
                Get 10% OFF Code (Use Code: HYPRIL10)
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 bg-white/15 border border-white/20 rounded-full px-4 py-2.5 text-xs text-white placeholder-emerald-100/60 focus:outline-none focus:border-[#E5B869]"
                />
                <button type="submit" className="bg-[#E5B869] hover:bg-[#d8a956] text-[#0D472E] py-2.5 px-5 text-xs font-black rounded-full shrink-0 shadow-sm">
                  Subscribe
                </button>
              </div>
            </form>
          </div>

          {/* Column 1: Shop */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-[#E5B869] uppercase tracking-wider">Shop Categories</h4>
            <ul className="space-y-2 font-semibold text-emerald-100/90">
              <li><Link to="/shop?category=Sex" className="hover:text-white transition-colors">Sexual Health</Link></li>
              <li><Link to="/shop?category=Hair" className="hover:text-white transition-colors">Hair Regrowth</Link></li>
              <li><Link to="/shop?category=Performance" className="hover:text-white transition-colors">Performance & Shilajit</Link></li>
              <li><Link to="/shop?category=Daily" className="hover:text-white transition-colors">Daily Multivitamin</Link></li>
            </ul>
          </div>

          {/* Column 2: Customer Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-[#E5B869] uppercase tracking-wider">Customer Care</h4>
            <ul className="space-y-2 font-semibold text-emerald-100/90">
              <li><a href="#contact" className="hover:text-white transition-colors">Contact Support</a></li>
              <li><Link to="/account" className="hover:text-white transition-colors">Track Your Order</Link></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Privacy & FAQs</a></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">Shopping Cart</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact & Address */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-[#E5B869] uppercase tracking-wider">Contact Us</h4>
            <div className="space-y-2 text-emerald-100/90 font-medium">
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#E5B869]" /> support@hypril.com
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#E5B869]" /> +91 1800-HYPRIL-CARE
              </p>
              <p className="pt-1 text-[11px] text-emerald-100/70 leading-tight">
                Hypril Healthcare Pvt. Ltd.<br />
                Bengaluru, Karnataka, India.
              </p>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="pt-8 border-t border-white/15 text-[10px] text-emerald-100/70 leading-relaxed space-y-2">
          <p>
            <strong>Medical Disclaimer:</strong> Statements regarding performance formulations and dietary supplements have been evaluated in clinical safety trials. Products are intended for adult intimacy and wellness enhancement. Consult a doctor if you have medical concerns.
          </p>
          <p>
            Complies with Indian Drugs & Cosmetic Rules & ASCI Standards. 100% Plain Box packaging guaranteed on all shipments.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-emerald-100/80 font-medium">
          <p>© {new Date().getFullYear()} Hypril Care. All rights reserved. Discreet. Effective. Scientific.</p>
          <div className="flex items-center gap-4 text-white font-bold">
            <span>UPI / GPay / Paytm</span>
            <span>•</span>
            <span>Cards & NetBanking</span>
            <span>•</span>
            <span>Cash on Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

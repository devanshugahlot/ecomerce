import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PackageCheck, ShieldCheck, Stethoscope, Lock, Mail, Phone, ArrowRight } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const { addToast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('Please enter a valid email address.', 'error');
      return;
    }
    addToast('Thank you for subscribing! Your 15% discount code is BOLD15.', 'success');
    setEmail('');
  };

  return (
    <footer className="bg-[#0F3D2B] text-white pt-16 pb-24 lg:pb-12 text-xs border-t border-[#0F3D2B]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Feature Highlights Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-white/10">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="p-3 rounded-xl bg-[#B8924A]/20 text-[#B8924A]">
              <PackageCheck className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-extrabold text-sm text-white">100% Discreet Packaging</h4>
              <p className="text-xs text-emerald-200/80">Plain unmarked box with zero product names printed.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="p-3 rounded-xl bg-[#B8924A]/20 text-[#B8924A]">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-extrabold text-sm text-white">Doctor Formulated</h4>
              <p className="text-xs text-emerald-200/80">Clinical-grade extracts & batch verified dosages.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="p-3 rounded-xl bg-[#B8924A]/20 text-[#B8924A]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-extrabold text-sm text-white">Quality Inspected</h4>
              <p className="text-xs text-emerald-200/80">FSSAI approved & GMP certified manufacturing.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="p-3 rounded-xl bg-[#B8924A]/20 text-[#B8924A]">
              <Lock className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-extrabold text-sm text-white">Secure Encrypted Payments</h4>
              <p className="text-xs text-emerald-200/80">Razorpay 256-Bit SSL protection & COD options.</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Brand Info & Newsletter */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white text-[#0F3D2B] flex items-center justify-center font-serif font-black text-xl">
                B
              </div>
              <span className="font-serif font-black text-2xl tracking-tight text-white">
                Bold Care
              </span>
            </Link>
            
            <p className="text-xs text-emerald-100/80 max-w-sm leading-relaxed font-medium">
              Confident. Clinical. Discreet. India's premium men's health and intimacy brand, delivering science-backed stamina, Shilajit, hair care, and wellness directly to your doorstep.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2 pt-2 max-w-sm">
              <label className="text-[11px] font-extrabold uppercase text-[#B8924A] tracking-wider block">
                Join Wellness Circle (15% OFF First Order)
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2.5 text-xs text-white placeholder-emerald-200/60 focus:outline-none focus:border-[#B8924A]"
                />
                <button type="submit" className="btn-gold py-2.5 px-5 text-xs font-bold shrink-0 shadow-sm">
                  Subscribe
                </button>
              </div>
            </form>
          </div>

          {/* Column 1: Shop */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-[#B8924A] uppercase tracking-wider">Shop Solutions</h4>
            <ul className="space-y-2 font-semibold text-emerald-100/80">
              <li><Link to="/shop?category=Sexual%20Wellness" className="hover:text-white transition-colors">Sexual Wellness</Link></li>
              <li><Link to="/shop?category=Daily%20Performance" className="hover:text-white transition-colors">Shilajit & Daily Health</Link></li>
              <li><Link to="/shop?category=Condoms%20%26%20Lubes" className="hover:text-white transition-colors">Condoms & Lubes</Link></li>
              <li><Link to="/shop?category=Grooming%20%26%20Hair" className="hover:text-white transition-colors">Hair & Beard Care</Link></li>
              <li><Link to="/shop?category=Intimate%20Care" className="hover:text-white transition-colors">Intimate Hygiene</Link></li>
            </ul>
          </div>

          {/* Column 2: Customer Help */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-[#B8924A] uppercase tracking-wider">Customer Help</h4>
            <ul className="space-y-2 font-semibold text-emerald-100/80">
              <li><Link to="/account" className="hover:text-white transition-colors">Track Orders</Link></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Privacy & FAQ</a></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">View Cart</Link></li>
              <li><Link to="/wishlist" className="hover:text-white transition-colors">Saved Wishlist</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-[#B8924A] uppercase tracking-wider">Contact & Legal</h4>
            <div className="space-y-2 text-emerald-100/80 font-medium">
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#B8924A]" /> support@boldcare.in
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#B8924A]" /> +91 1800-BOLD-CARE
              </p>
              <p className="pt-1 text-[11px] text-emerald-200/60 leading-tight">
                Bold Care Healthcare Pvt. Ltd.<br />
                Mumbai, Maharashtra, India.
              </p>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="pt-8 border-t border-white/10 text-[10px] text-emerald-200/60 leading-relaxed space-y-2">
          <p>
            <strong>Medical Disclaimer:</strong> Statements regarding dietary supplements have not been evaluated by FDA/FSSAI for disease treatment. Products are not intended to diagnose, treat, cure, or prevent any medical condition. Always consult a certified medical doctor before starting any healthcare regimen.
          </p>
          <p>
            Complies with Indian Drugs and Magic Remedies Act & ASCI Advertising Guidelines. 100% Confidential packaging assured on all dispatches.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-emerald-200/70 font-medium">
          <p>© {new Date().getFullYear()} Bold Care Inc. All rights reserved. Confident. Clinical. Discreet.</p>
          <div className="flex items-center gap-4 text-white font-bold">
            <span>UPI Instant</span>
            <span>•</span>
            <span>Visa & Mastercard</span>
            <span>•</span>
            <span>Cash on Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

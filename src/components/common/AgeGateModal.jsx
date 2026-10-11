import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Check } from 'lucide-react';

export const AgeGateModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const verified = localStorage.getItem('hypril_age_verified') || localStorage.getItem('boldcare_age_verified');
    if (!verified) {
      setIsOpen(true);
    }
  }, []);

  const handleVerify = () => {
    localStorage.setItem('hypril_age_verified', 'true');
    localStorage.setItem('boldcare_age_verified', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 max-w-md w-full text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-neutral-100 border border-neutral-200 text-black mx-auto flex items-center justify-center">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">
            CONFIDENTIAL & AGE-RESTRICTED (18+)
          </span>
          <h2 className="text-2xl font-heading font-black text-black">
            Welcome to Hypril
          </h2>
          <p className="text-xs text-neutral-600 leading-relaxed">
            This storefront contains adult wellness formulations. Please confirm that you are at least 18 years of age to proceed.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleVerify}
            className="btn-primary w-full py-4 text-xs font-bold rounded-full min-h-[48px] flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>I am 18 years or older — Enter Store</span>
          </button>
          
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-500 pt-1">
            <Lock className="w-3.5 h-3.5 text-black" />
            <span>100% Private Browsing & Discreet Plain Box Shipping</span>
          </div>
        </div>
      </div>
    </div>
  );
};

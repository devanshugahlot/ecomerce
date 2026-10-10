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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1B1F1D]/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#FAF7F2] border border-[#E4E0D8] rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-[#0F3D2B]/10 border border-[#0F3D2B]/20 text-[#0F3D2B] mx-auto flex items-center justify-center">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-extrabold text-[#B8924A] uppercase tracking-widest block">
            CONFIDENTIAL & AGE-RESTRICTED (18+)
          </span>
          <h2 className="text-2xl font-serif font-extrabold text-[#1B1F1D]">
            Welcome to Hypril™
          </h2>
          <p className="text-xs text-[#5B655F] leading-relaxed">
            This site contains health, wellness, and adult sexual health products. Please confirm that you are at least 18 years old to proceed.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleVerify}
            className="btn-primary w-full py-3.5 font-bold shadow-glow-forest flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>I am 18 years or older — Enter Site</span>
          </button>
          
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#5B655F] pt-1">
            <Lock className="w-3 h-3 text-[#0F3D2B]" />
            <span>100% Private Browsing & Discreet Shipping Assured</span>
          </div>
        </div>
      </div>
    </div>
  );
};

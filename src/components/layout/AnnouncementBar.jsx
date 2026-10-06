import React, { useState } from 'react';
import { PackageCheck, Truck, ShieldCheck, X, Sparkles } from 'lucide-react';

export const AnnouncementBar = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-[#0F3D2B] text-white py-2 px-4 text-xs font-semibold tracking-wide flex items-center justify-between relative z-40">
      <div className="flex-1 text-center flex items-center justify-center gap-2 sm:gap-6 overflow-x-auto no-scrollbar py-0.5">
        <span className="inline-flex items-center gap-1.5 shrink-0 text-emerald-200">
          <PackageCheck className="w-3.5 h-3.5 text-[#B8924A]" />
          <span>Free & Discreet Delivery</span>
        </span>
        <span className="hidden sm:inline text-[#B8924A]">•</span>
        <span className="inline-flex items-center gap-1.5 shrink-0 text-emerald-100">
          <Truck className="w-3.5 h-3.5 text-emerald-300" />
          <span>COD Available Across India</span>
        </span>
        <span className="hidden md:inline text-[#B8924A]">•</span>
        <span className="hidden md:inline-flex items-center gap-1.5 shrink-0 text-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-[#B8924A]" />
          <span>100% Plain Unmarked Outer Packaging</span>
        </span>
      </div>

      <button
        onClick={() => setVisible(false)}
        className="text-emerald-300 hover:text-white transition-colors ml-2 shrink-0 p-0.5"
        aria-label="Dismiss announcement"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

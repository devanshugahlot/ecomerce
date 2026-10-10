import React, { useState } from 'react';
import { PackageCheck, Truck, ShieldCheck, X } from 'lucide-react';

export const AnnouncementBar = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-[#0D472E] text-white py-2 px-4 text-xs font-semibold tracking-wide flex items-center justify-between relative z-40 shadow-sm border-b border-[#093522]">
      <div className="flex-1 text-center flex items-center justify-center gap-2 sm:gap-6 overflow-x-auto no-scrollbar py-0.5">
        <span className="inline-flex items-center gap-1.5 shrink-0 text-emerald-100">
          <PackageCheck className="w-3.5 h-3.5 text-[#E5B869]" />
          <span>100% Plain Box Discreet Packaging</span>
        </span>
        <span className="hidden sm:inline text-emerald-300/40">•</span>
        <span className="inline-flex items-center gap-1.5 shrink-0 text-white">
          <Truck className="w-3.5 h-3.5 text-emerald-300" />
          <span>Free Shipping Over ₹499 & Cash On Delivery Available</span>
        </span>
        <span className="hidden md:inline text-emerald-300/40">•</span>
        <span className="hidden md:inline-flex items-center gap-1.5 shrink-0 text-emerald-100">
          <ShieldCheck className="w-3.5 h-3.5 text-[#E5B869]" />
          <span>Use Code: <strong className="text-white font-black underline tracking-wider ml-0.5">BOLD10</strong> for 10% OFF</span>
        </span>
      </div>

      <button
        onClick={() => setVisible(false)}
        className="text-emerald-200 hover:text-white transition-colors ml-2 shrink-0 p-0.5"
        aria-label="Dismiss announcement"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

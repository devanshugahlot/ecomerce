import React from 'react';
import { ShieldCheck, Truck, Sparkles, CheckCircle, Heart, Star } from 'lucide-react';

export const AnnouncementBar = () => {
  return (
    <div className="bg-[#FFF0F5] text-slate-800 border-b border-pink-100 py-2 px-4 text-xs font-bold text-center flex items-center justify-center gap-8 overflow-x-auto whitespace-nowrap shadow-sm select-none">
      <div className="flex items-center gap-1.5 shrink-0 text-pink-700 font-bold">
        <Sparkles className="w-3.5 h-3.5 fill-pink-500 text-pink-600" />
        <span>India's No. 1 Men's Wellness Brand</span>
      </div>
      <div className="flex items-center gap-1.5 shrink-0 text-slate-700">
        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
        <span>COD Available</span>
      </div>
      <div className="hidden sm:flex items-center gap-1.5 shrink-0 text-slate-700">
        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
        <span>Trusted by 50 Lakh+ Indian Men</span>
      </div>
      <div className="hidden md:flex items-center gap-1.5 shrink-0 text-slate-700">
        <Truck className="w-3.5 h-3.5 text-slate-800" />
        <span>Free, Fast, & Discreet Delivery</span>
      </div>
      <div className="hidden lg:flex items-center gap-1.5 shrink-0 text-amber-700 bg-amber-100/60 px-2.5 py-0.5 rounded-full text-[11px]">
        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
        <span>Use Code <strong>VYRO10</strong> for 10% OFF</span>
      </div>
    </div>
  );
};

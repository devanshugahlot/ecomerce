import React from 'react';
import { ShieldCheck, Truck, Sparkles, CheckCircle2 } from 'lucide-react';

export const AnnouncementBar = () => {
  const items = [
    { text: "India's No. 1 Men's Wellness Brand", icon: ShieldCheck },
    { text: "COD Available", icon: CheckCircle2 },
    { text: "Trusted by 25 Lakh+ Indian Men", icon: Sparkles },
    { text: "Free, Fast, & Discreet Delivery", icon: Truck },
  ];

  // Duplicate items array 4 times for seamless 100% infinite marquee loop
  const marqueeItems = [...items, ...items, ...items, ...items];

  return (
    <div className="bg-[#0D472E] text-white py-2 overflow-hidden border-b border-[#093522] relative z-40 select-none shadow-sm">
      <div className="animate-marquee flex items-center">
        {marqueeItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="flex items-center gap-2.5 mx-5 shrink-0 text-xs font-bold tracking-wide">
              <Icon className="w-3.5 h-3.5 text-[#E5B869] shrink-0" />
              <span className="text-white">{item.text}</span>
              <span className="text-emerald-400/40 ml-2.5">•</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnnouncementBar;

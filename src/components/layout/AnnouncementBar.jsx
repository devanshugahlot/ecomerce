import React from 'react';
import { ShieldCheck, Truck, Sparkles, CheckCircle2 } from 'lucide-react';

export const AnnouncementBar = () => {
  const items = [
    { text: "Free & Discreet Delivery", icon: Truck },
    { text: "Cash on Delivery Available", icon: CheckCircle2 },
    { text: "Secure Payments", icon: ShieldCheck },
    { text: "100% Plain Box Packaging", icon: ShieldCheck },
  ];

  // Duplicate items array 4 times for seamless 100% infinite marquee loop
  const marqueeItems = [...items, ...items, ...items, ...items];

  return (
    <div className="bg-brand-green text-white py-2.5 overflow-hidden border-b border-brand-greenDark relative z-40 select-none">
      <div className="animate-marquee flex items-center">
        {marqueeItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="flex items-center gap-2.5 mx-6 shrink-0 text-xs font-medium tracking-wide">
              <Icon className="w-3.5 h-3.5 text-white/80 shrink-0" />
              <span className="text-white font-medium">{item.text}</span>
              <span className="text-white/40 ml-4">•</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnnouncementBar;

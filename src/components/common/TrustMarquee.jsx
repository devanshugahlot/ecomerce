import React from 'react';
import { ShieldCheck, Truck, Users, Award, Lock } from 'lucide-react';

const CLAIMS = [
  { icon: Truck, text: 'Free & Discreet Shipping across India' },
  { icon: ShieldCheck, text: '100% Plain Box Discreet Packaging' },
  { icon: Lock, text: 'Cash on Delivery (COD) Available' },
  { icon: ShieldCheck, text: 'Secure Payments & Privacy Protected' },
];

export const TrustMarquee = () => {
  return (
    <div className="bg-secondary text-white py-2.5 overflow-hidden border-y border-secondary-hover/40 text-xs font-semibold tracking-wide">
      <div className="flex items-center space-x-12 animate-marquee whitespace-nowrap min-w-full">
        {[...CLAIMS, ...CLAIMS, ...CLAIMS].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="inline-flex items-center gap-2 shrink-0 opacity-90 hover:opacity-100 transition-opacity">
              <Icon className="w-4 h-4 text-accent shrink-0" />
              <span>{item.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

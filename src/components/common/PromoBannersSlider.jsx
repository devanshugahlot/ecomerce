import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const PROMO_CARDS = [
  {
    id: 1,
    title: 'DATE NIGHT KITS',
    subtitle: 'Flat 35% OFF on Ultimate Intimacy Combo',
    gradient: 'from-amber-600 via-orange-600 to-amber-700',
    tag: 'LIMITED EDITION BUNDLE',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 2,
    title: 'STAMINA 90-DAY PACK',
    subtitle: 'Buy 3 Packs & Save ₹800 instantly',
    gradient: 'from-rose-700 via-pink-700 to-purple-800',
    tag: 'MOST POPULAR VALUE',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 3,
    title: 'VITALITY ESSENTIALS',
    subtitle: 'Free Express Shipping + Plain Box Dispatch',
    gradient: 'from-teal-700 via-emerald-800 to-secondary',
    tag: 'AYUSH FORMULATED',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=400'
  }
];

export const PromoBannersSlider = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="eyebrow-label">SPECIAL OFFERS</span>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900">
            Exclusive Regimen Kits
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PROMO_CARDS.map((card) => (
          <div
            key={card.id}
            className={`bg-gradient-to-br ${card.gradient} text-white rounded-[20px] p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-md border border-white/10 relative overflow-hidden group min-h-[250px]`}
          >
            <div className="space-y-2 max-w-[65%] z-10">
              <span className="bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full backdrop-blur-xs inline-block">
                {card.tag}
              </span>
              <h3 className="text-xl sm:text-2xl font-heading font-black leading-tight">
                {card.title}
              </h3>
              <p className="text-xs text-white/90 font-medium leading-relaxed">{card.subtitle}</p>
            </div>

            <Link
              to="/shop"
              className="bg-slate-950 hover:bg-black text-white font-bold text-xs py-3 px-5 rounded-lg inline-flex items-center gap-2 self-start shadow-md group-hover:scale-105 transition-transform z-10"
            >
              <span>ORDER NOW</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Stand / Image Graphic on Right */}
            <div className="absolute right-[-10px] bottom-[-10px] w-40 h-40 rounded-full bg-white/10 p-2 backdrop-blur-xs group-hover:scale-110 transition-transform duration-500">
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover rounded-full shadow-lg"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

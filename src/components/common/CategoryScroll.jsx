import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Flame, Zap, Shield, Heart, Award } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';

export const CategoryScroll = ({ activeCategory, onSelectCategory }) => {
  const { categories } = useProducts();
  if (!categories || categories.length === 0) return null;

  return (
    <div className="w-full bg-white border-b border-slate-200/80 py-4 px-4 overflow-x-auto no-scrollbar shadow-xs">
      <div className="max-w-[1536px] mx-auto flex items-center justify-start sm:justify-center gap-5 sm:gap-8 min-w-max px-2">
        
        {/* All / Bestsellers Story Pill */}
        <button
          onClick={() => onSelectCategory && onSelectCategory('All')}
          className="flex flex-col items-center gap-1.5 group cursor-pointer text-center relative"
        >
          <div
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 border-2 transition-all duration-300 transform group-hover:scale-105 shadow-xs ${
              activeCategory === 'All'
                ? 'border-[#0D472E] ring-2 ring-[#0D472E]/30 scale-105'
                : 'border-slate-200 group-hover:border-[#0D472E]'
            }`}
          >
            <div className="w-full h-full rounded-full bg-[#0D472E] text-white flex items-center justify-center font-black">
              <Sparkles className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
          </div>
          <span className={`text-xs font-bold transition-colors ${activeCategory === 'All' ? 'text-[#0D472E] font-black' : 'text-slate-800'}`}>
            All Products
          </span>
        </button>

        {/* Dynamic Categories Created by Admin */}
        {categories.map((cat) => {
          const isSelected = activeCategory === cat.slug || activeCategory === cat.name;

          return (
            <button
              key={cat.id || cat.slug}
              onClick={() => onSelectCategory && onSelectCategory(cat.slug || cat.name)}
              className="flex flex-col items-center gap-1.5 group cursor-pointer text-center relative"
            >
              {cat.badge && (
                <span className="absolute -top-1.5 z-10 bg-[#0D472E] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-2xs uppercase tracking-tighter scale-90">
                  {cat.badge}
                </span>
              )}

              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 border-2 transition-all duration-300 transform group-hover:scale-105 shadow-xs ${
                  isSelected
                    ? 'border-[#0D472E] ring-2 ring-[#0D472E]/30 scale-105'
                    : 'border-slate-200 group-hover:border-[#0D472E]'
                }`}
              >
                <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 flex items-center justify-center">
                  <img
                    src={cat.image || '/images/cat_bestsellers.png'}
                    alt={cat.name}
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200';
                    }}
                  />
                </div>
              </div>

              <span
                className={`text-xs font-bold transition-colors ${
                  isSelected ? 'text-[#0D472E] font-black' : 'text-slate-800 group-hover:text-[#0D472E]'
                }`}
              >
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

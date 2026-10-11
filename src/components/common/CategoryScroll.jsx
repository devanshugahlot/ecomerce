import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Flame, Zap, Shield, Heart, Award } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';

export const CategoryScroll = ({ activeCategory, onSelectCategory }) => {
  const { categories } = useProducts();
  if (!categories || categories.length === 0) return null;

  return (
    <div className="w-full bg-white border-b border-[#E5E5E5] py-3.5 px-4 overflow-x-auto no-scrollbar">
      <div className="max-w-[1536px] mx-auto flex items-center justify-start sm:justify-center gap-4 sm:gap-6 min-w-max px-2">
        {/* Dynamic Categories Created by Admin (Only Real Categories) */}
        {categories.map((cat) => {
          const isSelected = activeCategory === cat.slug || activeCategory === cat.name;

          return (
            <button
              key={cat.id || cat.slug || cat._id}
              onClick={() => onSelectCategory && onSelectCategory(isSelected ? 'All' : (cat.slug || cat.name))}
              className="flex flex-col items-center gap-1.5 group cursor-pointer text-center relative focus:outline-none"
            >
              {cat.badge && (
                <span className="absolute -top-1 z-10 bg-black text-white text-[8px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-tight scale-90">
                  {cat.badge}
                </span>
              )}

              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full p-0.5 border-2 transition-all duration-200 shadow-xs ${
                  isSelected
                    ? 'border-black ring-2 ring-black/15 scale-105'
                    : 'border-[#E5E5E5] group-hover:border-black'
                }`}
              >
                <div className="w-full h-full rounded-full overflow-hidden bg-[#F5F5F5] flex items-center justify-center">
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
                className={`text-[11px] sm:text-xs max-w-[72px] sm:max-w-[84px] truncate block transition-colors ${
                  isSelected ? 'text-black font-bold' : 'text-neutral-700 group-hover:text-black font-medium'
                }`}
                title={cat.name}
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

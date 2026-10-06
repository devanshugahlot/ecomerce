import React from 'react';
import { Star } from 'lucide-react';

export const RatingStars = ({ rating = 5, reviewCount, size = 'sm', className = '' }) => {
  const numStars = 5;
  const starSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center gap-0.5 text-amber-400">
        {[...Array(numStars)].map((_, idx) => (
          <Star
            key={idx}
            className={`${starSizes[size] || starSizes.sm} ${
              idx < Math.floor(rating)
                ? 'fill-amber-400 text-amber-400'
                : idx < rating
                ? 'fill-amber-400/50 text-amber-400'
                : 'text-dark-300'
            }`}
          />
        ))}
      </div>
      <span className="text-xs font-semibold text-slate-200">
        {rating.toFixed(1)}
      </span>
      {reviewCount !== undefined && (
        <span className="text-xs text-slate-400">({reviewCount})</span>
      )}
    </div>
  );
};

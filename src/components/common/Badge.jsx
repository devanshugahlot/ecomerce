import React from 'react';

export const Badge = ({ children, variant = 'brand', className = '' }) => {
  const variants = {
    brand: 'bg-black text-white border-black',
    amber: 'bg-neutral-100 text-neutral-800 border-neutral-300',
    red: 'bg-neutral-100 text-black border-neutral-300',
    dark: 'bg-neutral-900 text-white border-neutral-800',
    emerald: 'bg-black text-white border-black',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
        variants[variant] || variants.brand
      } ${className}`}
    >
      {children}
    </span>
  );
};

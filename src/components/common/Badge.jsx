import React from 'react';

export const Badge = ({ children, variant = 'brand', className = '' }) => {
  const variants = {
    brand: 'bg-brand-green text-white border-brand-green',
    amber: 'bg-neutral-100 text-neutral-800 border-neutral-300',
    red: 'bg-neutral-100 text-black border-neutral-300',
    dark: 'bg-brand-green text-white border-brand-green',
    emerald: 'bg-brand-green text-white border-brand-green',
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

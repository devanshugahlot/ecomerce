import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import { RatingStars } from './RatingStars';
import { Badge } from './Badge';
import { formatCurrency, calculateDiscount } from '../../utils/currency';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const ProductCard = ({ product }) => {
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  if (!product) return null;

  const id = product._id || product.id || 'prod_fallback';
  const isSaved = id ? isInWishlist(id) : false;
  const discount = calculateDiscount(product.price || 0, product.comparePrice || 0);



  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);

    setTimeout(() => {
      addToCart(product, 1);
      setAdding(false);
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    }, 250);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const mainImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : product.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600';

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-500/60 transition-all duration-300 flex flex-col overflow-hidden shadow-sm hover:shadow-md">
      {/* Product Image Container */}
      <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden">
        <Link to={`/products/${product.slug || id}`}>
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.isBestSeller && <Badge variant="amber">Bestseller</Badge>}
          {discount > 0 && <Badge variant="emerald">{discount}% OFF</Badge>}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          aria-label="Save to Wishlist"
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all duration-200 z-10 ${
            isSaved
              ? 'bg-rose-500 text-white shadow-sm'
              : 'bg-white/80 text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-200'
          }`}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs text-emerald-700 font-bold mb-1">
            <span className="capitalize">{product.category || 'Wellness'}</span>
            <RatingStars rating={product.rating || 4.8} reviewCount={product.reviewCount || 124} size="xs" />
          </div>

          <Link to={`/products/${product.slug || id}`}>
            <h3 className="font-extrabold text-base text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
            {product.benefitSummary || product.description || 'Science-backed daily formula for peak performance.'}
          </p>
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-extrabold text-slate-900">
                {formatCurrency(product.price)}
              </span>
              {product.comparePrice > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  {formatCurrency(product.comparePrice)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={adding || product.stock <= 0}
            className={`btn-primary px-3.5 py-2 text-xs rounded-xl font-bold shrink-0 shadow-sm ${
              added ? 'bg-emerald-700 text-white' : ''
            }`}
          >
            {adding ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : added ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

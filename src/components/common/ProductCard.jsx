import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Check, Star } from 'lucide-react';
import { formatCurrency, calculateDiscount } from '../../utils/currency';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const ProductCard = ({ product }) => {
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [selectedPackIndex, setSelectedPackIndex] = useState(0);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  if (!product) return null;

  const id = product._id || product.id || 'prod_fallback';
  const isSaved = id ? isInWishlist(id) : false;

  const packs = product.packs && product.packs.length > 0 ? product.packs : [
    { name: '1 Pack', price: product.price || 499, comparePrice: product.comparePrice || 799 },
    { name: '2 Pack', price: Math.round((product.price || 499) * 1.8), comparePrice: (product.comparePrice || 799) * 2 },
  ];
  
  const currentPrice = packs && packs[selectedPackIndex] ? packs[selectedPackIndex].price : (product.price || 499);
  const currentCompare = packs && packs[selectedPackIndex] ? packs[selectedPackIndex].comparePrice : (product.comparePrice || 799);

  const discount = calculateDiscount(currentPrice || 0, currentCompare || 0);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);

    const selectedVariant = packs && packs[selectedPackIndex] ? { name: packs[selectedPackIndex].name } : null;

    setTimeout(() => {
      addToCart({ ...product, price: currentPrice }, 1, selectedVariant);
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

  const mainImage = (product.images && product.images[0] && product.images[0].trim() !== '')
    ? product.images[0]
    : (product.image && product.image.trim() !== '' ? product.image : 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600');

  return (
    <div className="group relative bg-[#F8FAFC] rounded-[20px] p-4 border border-slate-200/80 hover:border-[#0D472E]/50 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-lg">
      
      {/* Top Row: Best Seller Pill + Star Rating */}
      <div className="flex items-center justify-between z-10 mb-2">
        {product.isBestSeller ? (
          <span className="border border-[#0D472E]/20 bg-[#0D472E] text-white font-bold text-[10px] px-2.5 py-1 rounded-full shadow-2xs flex items-center gap-1 uppercase tracking-wider">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> Best Seller
          </span>
        ) : (
          <span className="border border-slate-200 bg-white text-slate-700 font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">
            {product.category || 'Product'}
          </span>
        )}

        <div className="flex items-center gap-1 text-amber-500 font-bold text-xs bg-white px-2 py-1 rounded-full border border-slate-200/80 shadow-2xs">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span className="text-slate-900">{product.rating || 5.0}</span>
        </div>
      </div>

      {/* Product Image Container */}
      <div className="relative aspect-square bg-white rounded-2xl overflow-hidden mb-3 group/img border border-slate-100">
        <Link to={`/products/${product.slug || id}`} className="block w-full h-full p-2">
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover object-center rounded-xl group-hover/img:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600';
            }}
            loading="lazy"
          />
        </Link>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleWishlist}
          aria-label="Save to Wishlist"
          className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md transition-all duration-200 z-10 ${
            isSaved
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white/90 text-slate-600 hover:text-rose-600 border border-slate-200/80'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <div className="space-y-3 text-center flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <Link to={`/products/${product.slug || id}`}>
            <h3 className="font-heading font-extrabold text-[18px] sm:text-[20px] text-slate-900 group-hover:text-[#0D472E] transition-colors line-clamp-2 leading-tight">
              {product.name}
            </h3>
          </Link>

          {/* Pack Options Selector */}
          {packs && packs.length > 0 && (
            <div className="pt-1 flex items-center justify-center gap-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pack:</span>
              {packs.slice(0, 3).map((p, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedPackIndex(idx);
                  }}
                  className={`w-[36px] h-[36px] rounded-[6px] text-xs font-bold flex items-center justify-center transition-all ${
                    selectedPackIndex === idx
                      ? 'bg-[#0D472E] text-white font-black shadow-xs'
                      : 'border border-slate-300 bg-white text-slate-700 hover:border-[#0D472E]'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price Row */}
        <div className="pt-2 space-y-3">
          <div className="text-center space-y-0.5">
            <div className="text-[26px] sm:text-[30px] font-heading font-black text-slate-900 leading-none">
              {formatCurrency(currentPrice)}
            </div>
            <div className="flex items-center justify-center gap-2 text-xs">
              {currentCompare > currentPrice && (
                <span className="text-slate-400 line-through font-medium">
                  {formatCurrency(currentCompare)}
                </span>
              )}
              {discount > 0 && (
                <span className="font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {discount}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Full-width Add to Cart Button */}
          <button
            onClick={handleQuickAdd}
            disabled={adding}
            className={`w-full h-[52px] rounded-[10px] bg-[#0D472E] hover:bg-[#08301E] text-white font-heading font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] ${
              added ? 'bg-emerald-800' : ''
            }`}
          >
            {adding ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : added ? (
              <>
                <Check className="w-4 h-4" />
                <span>ADDED TO CART</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>ADD TO CART</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

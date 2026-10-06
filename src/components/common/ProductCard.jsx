import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Check, ShieldCheck, Sparkles, Star } from 'lucide-react';
import { Badge } from './Badge';
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

  const packs = product.packs && product.packs.length > 0 ? product.packs : null;
  const currentPrice = packs ? packs[selectedPackIndex].price : product.price;
  const currentCompare = packs ? packs[selectedPackIndex].comparePrice : product.comparePrice;

  const discount = calculateDiscount(currentPrice || 0, currentCompare || 0);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);

    const selectedVariant = packs ? { name: packs[selectedPackIndex].name } : null;

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

  const mainImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : product.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600';

  const hoverImage = product.images && product.images.length > 1 ? product.images[1] : mainImage;

  return (
    <div className="group relative bg-white rounded-2xl border border-[#E4E0D8] hover:border-[#0F3D2B]/40 transition-all duration-300 flex flex-col overflow-hidden shadow-premium hover:shadow-2xl">
      
      {/* Product Image Container (4:5 Aspect Ratio) */}
      <div className="relative aspect-[4/5] bg-[#FAF7F2] overflow-hidden">
        <Link to={`/products/${product.slug || id}`} className="block w-full h-full">
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:opacity-0 transition-opacity duration-500 ease-out"
            loading="lazy"
          />
          <img
            src={hoverImage}
            alt={`${product.name} alternate`}
            className="w-full h-full object-cover object-center absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ease-out"
            loading="lazy"
          />
        </Link>

        {/* Top Left Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isBestSeller && (
            <span className="bg-[#B8924A] text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1 uppercase tracking-wider">
              <Sparkles className="w-3 h-3 fill-current" /> Bestseller
            </span>
          )}
          {product.isRx && (
            <span className="bg-[#0F3D2B] text-white font-extrabold text-[10px] px-2.5 py-0.5 rounded-full shadow-sm uppercase tracking-wider">
              Doctor Consult
            </span>
          )}
          {discount > 0 && (
            <span className="bg-[#B5472F] text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow-sm">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          aria-label="Save to Wishlist"
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all duration-200 z-10 ${
            isSaved
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-white/80 text-[#5B655F] hover:text-[#1B1F1D] hover:bg-white border border-[#E4E0D8]'
          }`}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Discreet Delivery Guarantee Footer Tag */}
        <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-[#E4E0D8] text-[10px] text-[#0F3D2B] font-bold flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <ShieldCheck className="w-3 h-3 text-[#B8924A]" />
          <span>100% Plain Box Packaging</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-[#0F3D2B] font-bold">
            <span className="capitalize text-[11px] text-[#5B655F]">{product.category || 'Wellness'}</span>
            <div className="flex items-center gap-1 text-[#B8924A] font-extrabold text-xs">
              <Star className="w-3.5 h-3.5 fill-[#B8924A]" />
              <span>{product.rating || 4.9}</span>
              <span className="text-[10px] text-[#5B655F] font-normal">({product.reviewCount || 180})</span>
            </div>
          </div>

          <Link to={`/products/${product.slug || id}`}>
            <h3 className="font-extrabold text-sm sm:text-base text-[#1B1F1D] group-hover:text-[#0F3D2B] transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-[#5B655F] line-clamp-2 leading-relaxed font-medium">
            {product.benefitSummary || product.description}
          </p>

          {/* Pack Options Selector Pills */}
          {packs && (
            <div className="pt-1 flex flex-wrap gap-1.5">
              {packs.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPackIndex(idx)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                    selectedPackIndex === idx
                      ? 'bg-[#0F3D2B] text-white shadow-sm'
                      : 'bg-[#FAF7F2] text-[#5B655F] border border-[#E4E0D8] hover:border-[#0F3D2B]'
                  }`}
                >
                  {p.name.split(' ')[0]} {p.name.split(' ')[1] || ''}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-[#E4E0D8] flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black text-[#1B1F1D]">
                {formatCurrency(currentPrice)}
              </span>
              {currentCompare > currentPrice && (
                <span className="text-xs text-[#5B655F] line-through">
                  {formatCurrency(currentCompare)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={adding || product.stock <= 0}
            className={`btn-primary px-4 py-2 text-xs rounded-full font-extrabold shrink-0 shadow-sm ${
              added ? 'bg-[#0F3D2B] text-white' : ''
            }`}
          >
            {adding ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

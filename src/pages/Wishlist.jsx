import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { ProductCard } from '../components/common/ProductCard';
import { useWishlist } from '../context/WishlistContext';

export const Wishlist = () => {
  const { wishlistItems } = useWishlist();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#FAF9F6] text-slate-900">
      <SEO title="My Saved Wishlist" description="Your saved VYRO men's wellness formulations." />

      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <h1 className="text-3xl font-serif font-extrabold text-slate-900 flex items-center gap-3">
          <Heart className="w-8 h-8 text-rose-500 fill-current" />
          My Saved Wishlist ({wishlistItems.length})
        </h1>
        <Link to="/shop" className="text-xs font-bold text-emerald-700 hover:underline">
          Explore All Products
        </Link>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-slate-200 shadow-sm max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Heart className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-serif font-bold text-slate-900">No saved products yet</h2>
          <p className="text-xs text-slate-600 font-medium">Save products to your wishlist while browsing.</p>
          <Link to="/shop" className="btn-primary text-xs py-3 px-6 inline-flex font-bold">
            Explore Shop
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

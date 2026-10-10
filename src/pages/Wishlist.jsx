import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { ProductCard } from '../components/common/ProductCard';
import { useWishlist } from '../context/WishlistContext';

export const Wishlist = () => {
  const { wishlistItems } = useWishlist();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-screen">
      <SEO title="My Saved Wishlist" description="Your saved Hypril men's wellness formulations." />

      <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 flex items-center gap-3">
          <Heart className="w-7 h-7 text-rose-500 fill-current" />
          <span>My Saved Wishlist</span>
          <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'}
          </span>
        </h1>
        <Link to="/shop" className="text-xs font-bold text-primary hover:underline">
          Explore All Formulations
        </Link>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-slate-200/80 shadow-sm max-w-md mx-auto my-12">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Heart className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-heading font-bold text-slate-900">No saved products yet</h2>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            Tap the heart icon on any formulation to save it to your personal wishlist for quick access later.
          </p>
          <Link to="/shop" className="btn-primary text-xs py-3 px-6 inline-flex font-bold shadow-md">
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

import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { ProductCard } from '../components/common/ProductCard';
import { useWishlist } from '../context/WishlistContext';

export const Wishlist = () => {
  const { wishlistItems } = useWishlist();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-[80vh] bg-white text-black">
      <SEO title="My Saved Wishlist" description="Your saved Hypril men's wellness formulations." />

      <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
        <h1 className="text-2xl sm:text-3xl font-heading font-black text-black flex items-center gap-3">
          <Heart className="w-7 h-7 text-black fill-current" />
          <span>My Saved Wishlist</span>
          <span className="text-xs font-bold text-black bg-neutral-100 px-2.5 py-1 rounded-full border border-neutral-300">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'}
          </span>
        </h1>
        <Link to="/shop" className="text-xs font-bold text-neutral-600 hover:text-black hover:underline">
          Explore All Products
        </Link>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center space-y-4 border border-neutral-200 shadow-2xs max-w-md mx-auto my-12">
          <div className="w-16 h-16 rounded-full bg-neutral-100 text-neutral-400 mx-auto flex items-center justify-center">
            <Heart className="w-8 h-8 text-neutral-500" />
          </div>
          <h2 className="text-xl font-heading font-bold text-black">No saved products yet</h2>
          <p className="text-xs text-neutral-500 font-medium leading-relaxed">
            Tap the heart icon on any product to save it to your personal wishlist for quick access later.
          </p>
          <Link to="/shop" className="btn-primary text-xs py-3.5 px-6 inline-flex font-bold rounded-full min-h-[48px] items-center justify-center">
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

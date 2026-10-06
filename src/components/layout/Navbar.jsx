import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Heart, User, Menu, X, Shield, ChevronDown, LogOut, LayoutDashboard } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { BRAND_NAME, CATEGORIES } from '../../utils/constants';

export const Navbar = ({ onOpenSearch }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdown, setCategoryDropdown] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  const { getItemCount, setIsCartOpen } = useCart();
  const { wishlistItems } = useWishlist();
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setCategoryDropdown(false);
    setUserDropdown(false);
  }, [location]);

  const itemCount = getItemCount();

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 bg-white ${
        isScrolled ? 'border-b border-slate-200 py-3 shadow-sm' : 'border-b border-slate-200 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo - Bold Black text matching Bold Care */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-extrabold text-2xl tracking-tight text-slate-900 font-sans">
              VYRO
            </span>
            <span className="hidden sm:inline text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              WELLNESS
            </span>
          </Link>

          {/* Desktop Navigation Links - Centered */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold">
            <Link
              to="/"
              className={`transition-colors hover:text-emerald-600 ${
                location.pathname === '/' ? 'text-emerald-600 font-bold' : 'text-slate-700'
              }`}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className={`transition-colors hover:text-emerald-600 ${
                location.pathname === '/shop' ? 'text-emerald-600 font-bold' : 'text-slate-700'
              }`}
            >
              Shop All
            </Link>

            {/* Categories Dropdown */}
            <div className="relative" onMouseLeave={() => setCategoryDropdown(false)}>
              <button
                onMouseEnter={() => setCategoryDropdown(true)}
                onClick={() => setCategoryDropdown(!categoryDropdown)}
                className="flex items-center gap-1 text-slate-700 hover:text-emerald-600 transition-colors py-2"
              >
                <span>Categories</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {categoryDropdown && (
                <div className="absolute top-full left-0 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 space-y-1 z-50">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.slug}
                      to={`/shop?category=${encodeURIComponent(cat.name)}`}
                      className="block px-3 py-2 rounded-xl text-xs text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 font-semibold transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <a
              href="/#faq"
              className="text-slate-700 hover:text-emerald-600 transition-colors"
            >
              FAQ
            </a>

            <Link
              to="/shop?bestseller=true"
              className="text-slate-700 hover:text-emerald-600 transition-colors flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Bestsellers</span>
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className="text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200 text-xs"
              >
                <LayoutDashboard className="w-4 h-4" />
                Admin Panel
              </Link>
            )}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="p-2.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-2"
              aria-label="Search Products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="relative p-2.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Account Menu */}
            <div className="relative">
              {user ? (
                <div className="relative" onMouseLeave={() => setUserDropdown(false)}>
                  <button
                    onClick={() => setUserDropdown(!userDropdown)}
                    className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-100 border border-slate-200 hover:border-emerald-500 transition-all"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                      {(user?.name && user.name[0]) ? user.name[0].toUpperCase() : 'U'}
                    </div>
                    <span className="hidden sm:inline text-xs font-bold text-slate-900 max-w-[90px] truncate">
                      {user?.name ? user.name.split(' ')[0] : 'User'}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  </button>

                  {userDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 space-y-1 z-50">
                      <div className="px-3 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'User'}</p>
                        <p className="text-[10px] text-slate-500 truncate">{user?.email || ''}</p>
                      </div>

                      <Link
                        to="/account"
                        className="block px-3 py-2 rounded-xl text-xs text-slate-700 hover:text-emerald-600 hover:bg-slate-50 font-medium transition-colors"
                      >
                        Dashboard & Orders
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="block px-3 py-2 rounded-xl text-xs text-amber-700 hover:bg-amber-50 font-bold transition-colors"
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={logout}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="btn-primary text-xs px-4 py-2 font-bold"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-slate-200 space-y-3 pb-2 bg-white">
            <Link
              to="/"
              className="block py-2 text-sm font-bold text-slate-900 hover:text-emerald-600"
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="block py-2 text-sm font-bold text-slate-900 hover:text-emerald-600"
            >
              Shop All Products
            </Link>

            <div className="py-2 space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Categories
              </span>
              <div className="grid grid-cols-2 gap-2 pt-1">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    to={`/shop?category=${encodeURIComponent(cat.name)}`}
                    className="p-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-800 hover:text-emerald-600"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {isAdmin && (
              <Link
                to="/admin"
                className="block py-2 text-sm font-bold text-amber-600"
              >
                Go to Admin Dashboard
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
